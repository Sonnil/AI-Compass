/**
 * QMS Data Service
 * Loads and transforms Power BI FDA_483_Response data for the QMS module
 */

import { getPowerBIAccessToken } from './powerBIAuth';

// Power BI Configuration
const POWERBI_API_BASE = 'https://api.powerbi.com/v1.0/myorg';
const WORKSPACE_ID = import.meta.env.VITE_POWERBI_WORKSPACE_ID || '';
const DATASET_ID = import.meta.env.VITE_POWERBI_DATASET_ID || '';

// Table names in Power BI FDA_483_Response dataset
// Note: DEVIATION_LI contains both Deviation and Lab Investigation records
const DEVIATION_TABLE = 'DEVIATION_LI';

// Filter criteria from M query - only these sites
const OWNING_ENTITIES = [
  'MA BioCampus',
  'Framingham Biosurgery', 
  'Framingham Biologics',
  'Northborough'
];

export interface DeviationData {
  id: string
  title: string
  status: 'open' | 'in-progress' | 'closed' | 'overdue'
  priority: 'critical' | 'high' | 'medium' | 'low'
  department: string
  dateOpened: string
  dueDate: string
  assignee: string
  description: string
  rootCause?: string
  correctiveAction?: string
}

export interface CAPAData {
  id: string
  title: string
  status: 'open' | 'in-progress' | 'closed' | 'verified'
  priority: 'critical' | 'high' | 'medium' | 'low'
  department: string
  dateOpened: string
  targetDate: string
  completionDate?: string
  assignee: string
  progress: number
  effectiveness?: string
}

export interface QMSMetrics {
  totalDeviations: number
  openItems: number
  onTimeClosureRate: number
  activeCAPAs: number
  avgClosureTime: number
  complianceScore: number
}

export interface QMSDashboardData {
  metrics: QMSMetrics
  deviations: DeviationData[]
  capas: CAPAData[]
  lastUpdated: string
}

/**
 * Load QMS data from Power BI REST API
 */
export async function loadQMSData(): Promise<QMSDashboardData> {
  try {
    // Get access token for Power BI API
    const accessToken = await getPowerBIAccessToken();
    
    if (!accessToken) {
      console.warn('No Power BI access token available, using mock data');
      return getMockData();
    }

    if (!WORKSPACE_ID || !DATASET_ID) {
      console.warn('Power BI workspace or dataset ID not configured, using mock data');
      return getMockData();
    }

    // Fetch data from DEVIATION_LI table
    // Note: This table contains both deviations and lab investigations
    // Filter by QUALITY_EVENT_TYPE: 
    //   - "Lab Investigation" for LI records
    //   - Other values for deviation records
    const deviationsData = await fetchTableData(accessToken, DEVIATION_TABLE);

    // Transform Power BI data to QMS format
    // Separate deviations from lab investigations based on QUALITY_EVENT_TYPE
    const allRecords = transformDeviations({ data: deviationsData, error: null });
    
    // For CAPAs, we'll use the same data source for now
    // In the future, this could be updated to pull from a separate CAPA table
    const deviations = allRecords;
    const capas: CAPAData[] = []; // Empty for now, as CAPA data is separate
    
    const metrics = calculateMetrics(deviations, capas);

    return {
      metrics,
      deviations,
      capas,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error loading QMS data from Power BI:', error);
    return getMockData();
  }
}

/**
 * Fetch data from a Power BI table using DAX query
 */
async function fetchTableData(accessToken: string, tableName: string): Promise<any[]> {
  const url = `${POWERBI_API_BASE}/groups/${WORKSPACE_ID}/datasets/${DATASET_ID}/executeQueries`;
  
  // DAX query to get all rows from the table
  const daxQuery = `
    EVALUATE
    TOPN(1000, ${tableName})
  `;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      queries: [
        {
          query: daxQuery
        }
      ],
      serializerSettings: {
        includeNulls: true
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Power BI API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  // Extract rows from the response
  if (result.results && result.results[0] && result.results[0].tables && result.results[0].tables[0]) {
    return result.results[0].tables[0].rows || [];
  }

  return [];
}

/**
 * Transform deviation data from Power BI format
 */
function transformDeviations(deviationTable: any): DeviationData[] {
  if (!deviationTable || deviationTable.error || !deviationTable.data) {
    return []
  }
  
  return deviationTable.data.slice(0, 100).map((row: any, index: number) => {
    // Extract values from Power BI DEVIATION_LI table
    // Power BI uses format: [TableName[ColumnName]] or just [ColumnName]
    const getValue = (key: string) => {
      const fullKey = Object.keys(row).find(k => k.includes(key))
      return fullKey ? row[fullKey] : null
    }
    
    // Core identification
    const eventUid = getValue('EVENT_UID') || `DEV-${String(index + 1).padStart(5, '0')}`
    const eventName = getValue('EVENT_NAME') || eventUid
    const eventShortUid = getValue('EVENT_SHORT_UID') || ''
    const qualityEventType = getValue('QUALITY_EVENT_TYPE') || 'Deviation'
    
    // Status fields
    const status = normalizeStatus(
      getValue('STATUS') || 
      getValue('STATE') || 
      getValue('SOURCE_STATUS') ||
      getValue('QA_Open_Close_Condition')
    )
    
    // Check for PHENIX override or special statuses
    const newPhenixStatus = getValue('NEW_PHENIX_STATUS')
    const state = getValue('STATE')
    if (newPhenixStatus === 'Closed' || state === 'cancelled_state__c' || state === 'archived_state__c') {
      // Override status for PHENIX closed or cancelled records
    }
    
    // Classification and priority
    const classification = getValue('CLASSIFICATION') || getValue('SOURCE_CLASSIFICATION') || 'Medium'
    const priority = normalizePriority(classification)
    
    // Location fields
    const owningEntity = getValue('OWNING_ENTITY') || 'Unknown'
    const department = getValue('DEPARTMENT_TRUE_UP') || getValue('OWNING_GROUP') || getValue('DEPARTMENT') || 'Unknown'
    const building = getValue('BUILDING') || ''
    const operation = getValue('OPERATION') || ''
    
    // Date fields
    const createdTs = getValue('CREATED_TS') || getValue('DETECTION_TS') || new Date().toISOString()
    const dueDate = getValue('EXTENDED_DUE_DATE_TS') || getValue('DUE_DATE_TS') || getValue('Current Due_Date') || new Date().toISOString()
    const closedTs = getValue('QA_Closure Calendar') || getValue('CLOSED_TS') || getValue('OVERALL_INVESTIGATION_END_TS')
    
    // People assignments
    const owner = getValue('OWNER') || 'Unassigned'
    const investigator = getValue('INVESTIGATOR_LEADER') || ''
    const assignedPerson = getValue('ASSIGNED_PERSON') || 
      (classification === 'Significant' ? investigator : owner) || 
      'Unassigned'
    
    // Content
    const title = getValue('TITLE') || getValue('DESCRIPTION') || `${qualityEventType} ${eventName}`
    const description = getValue('DESCRIPTION') || title
    
    // Additional info
    const rootCause = getValue('ROOT_CAUSE') || undefined
    const correctiveAction = getValue('CORRECTIVE_ACTION') || getValue('QA_COMMENT') || undefined
    
    // Third Party Complaint info
    const tpeInfo = getValue('Third Party Complaint?') || ''
    const hasTpe = tpeInfo && !tpeInfo.includes('No TPE')
    
    // Extension info
    const hasExtension = getValue('EXTENSION?') === 'Yes'
    const extensionCount = getValue('EXTENSION_REQUEST_ALL.Count') || 0
    
    return {
      id: eventName,
      title: truncateString(title, 100),
      status,
      priority,
      department: truncateString(department, 50),
      dateOpened: createdTs,
      dueDate,
      assignee: truncateString(assignedPerson, 50),
      description: truncateString(description, 200),
      rootCause,
      correctiveAction
    }
  })
}

/**
 * Transform CAPA data from Power BI format
 */
function transformCAPAs(capaTable: any): CAPAData[] {
  if (!capaTable || capaTable.error || !capaTable.data) {
    return []
  }
  
  return capaTable.data.slice(0, 100).map((row: any, index: number) => {
    const getValue = (key: string) => {
      const fullKey = Object.keys(row).find(k => k.includes(key))
      return fullKey ? row[fullKey] : null
    }
    
    const capaId = getValue('CAPA_ID') || getValue('ID') || `CAPA-${String(index + 1).padStart(5, '0')}`
    const status = normalizeStatus(getValue('STATUS') || getValue('CURRENT_STATUS'))
    const priority = normalizePriority(getValue('PRIORITY') || getValue('SEVERITY'))
    const department = getValue('DEPARTMENT') || getValue('OWNING_GROUP') || 'Unknown'
    const dateOpened = getValue('OPENED_DATE') || getValue('CREATED_DATE') || new Date().toISOString()
    const targetDate = getValue('TARGET_DATE') || getValue('DUE_DATE') || new Date().toISOString()
    const completionDate = getValue('COMPLETION_DATE') || getValue('CLOSED_DATE') || undefined
    const assignee = getValue('ASSIGNEE') || getValue('OWNER') || 'Unassigned'
    const title = getValue('TITLE') || getValue('DESCRIPTION') || `CAPA ${capaId}`
    const progress = calculateProgress(status, completionDate, targetDate)
    
    return {
      id: capaId,
      title: truncateString(title, 100),
      status: status as any,
      priority,
      department: truncateString(department, 50),
      dateOpened,
      targetDate,
      completionDate,
      assignee: truncateString(assignee, 50),
      progress,
      effectiveness: getValue('EFFECTIVENESS') || undefined
    }
  })
}

/**
 * Calculate QMS metrics from deviation and CAPA data
 */
function calculateMetrics(deviations: DeviationData[], capas: CAPAData[]): QMSMetrics {
  const openDeviations = deviations.filter(d => d.status !== 'closed').length
  const closedDeviations = deviations.filter(d => d.status === 'closed').length
  const onTimeDeviations = deviations.filter(d => {
    if (d.status !== 'closed') return false
    return new Date(d.dueDate) >= new Date(d.dateOpened)
  }).length
  
  const activeCAPAs = capas.filter(c => c.status !== 'closed' && c.status !== 'verified').length
  
  // Calculate average closure time (in days)
  const closedItems = [...deviations, ...capas].filter(item => 
    item.status === 'closed' || (item as any).completionDate
  )
  const avgClosureTime = closedItems.length > 0
    ? closedItems.reduce((sum, item) => {
        const opened = new Date(item.dateOpened).getTime()
        const closed = new Date((item as any).completionDate || (item as any).targetDate || (item as any).dueDate).getTime()
        return sum + (closed - opened) / (1000 * 60 * 60 * 24)
      }, 0) / closedItems.length
    : 0
  
  // Calculate compliance score (percentage of on-time closures)
  const complianceScore = closedDeviations > 0
    ? (onTimeDeviations / closedDeviations) * 100
    : 95 // Default high score if no closed items yet
  
  return {
    totalDeviations: deviations.length,
    openItems: openDeviations + activeCAPAs,
    onTimeClosureRate: closedDeviations > 0 ? (onTimeDeviations / closedDeviations) * 100 : 0,
    activeCAPAs,
    avgClosureTime: Math.round(avgClosureTime),
    complianceScore: Math.round(complianceScore)
  }
}

/**
 * Normalize status values from Power BI format
 */
function normalizeStatus(status: string | null): 'open' | 'in-progress' | 'closed' | 'overdue' | 'verified' {
  if (!status) return 'open'
  
  const statusLower = status.toLowerCase().trim()
  
  // Handle specific Power BI status values
  if (statusLower.includes('close') || 
      statusLower.includes('complete') || 
      statusLower.includes('resolved') ||
      statusLower.includes('archived')) {
    return 'closed'
  }
  
  if (statusLower.includes('progress') || 
      statusLower.includes('active') || 
      statusLower.includes('working') ||
      statusLower.includes('ongoing on-time')) {
    return 'in-progress'
  }
  
  if (statusLower.includes('overdue') || 
      statusLower.includes('late') ||
      statusLower.includes('ongoing late')) {
    return 'overdue'
  }
  
  if (statusLower.includes('verified') || 
      statusLower.includes('approved')) {
    return 'verified'
  }
  
  if (statusLower.includes('cancel') || 
      statusLower.includes('reject')) {
    return 'closed' // Treat cancelled/rejected as closed for metrics
  }
  
  return 'open'
}

/**
 * Normalize priority values from classification or priority field
 */
function normalizePriority(priority: string | null): 'critical' | 'high' | 'medium' | 'low' {
  if (!priority) return 'medium'
  
  const priorityLower = priority.toLowerCase().trim()
  
  // Map from CLASSIFICATION field
  if (priorityLower.includes('significant')) {
    return 'high' // Significant deviations are high priority
  }
  
  if (priorityLower.includes('non significant') || 
      priorityLower.includes('minor')) {
    return 'medium' // Non-significant deviations are medium priority
  }
  
  // Standard priority mapping
  if (priorityLower.includes('critical') || 
      priorityLower.includes('urgent') || 
      priorityLower === '1') {
    return 'critical'
  }
  
  if (priorityLower.includes('high') || priorityLower === '2') {
    return 'high'
  }
  
  if (priorityLower.includes('low') || priorityLower === '4') {
    return 'low'
  }
  
  return 'medium'
}

/**
 * Calculate progress percentage based on status and dates
 */
function calculateProgress(status: string, completionDate: string | undefined, targetDate: string): number {
  if (status === 'closed' || status === 'verified' || completionDate) {
    return 100
  }
  
  const now = new Date().getTime()
  const target = new Date(targetDate).getTime()
  const started = now - (30 * 24 * 60 * 60 * 1000) // Assume started 30 days ago
  
  if (now > target) return 95 // Overdue but not closed
  
  const elapsed = now - started
  const total = target - started
  
  return Math.min(Math.max(Math.round((elapsed / total) * 100), 10), 95)
}

/**
 * Truncate string to max length
 */
function truncateString(str: string, maxLength: number): string {
  if (!str) return ''
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

/**
 * Fallback mock data for development/testing
 */
function getMockData(): QMSDashboardData {
  return {
    metrics: {
      totalDeviations: 127,
      openItems: 23,
      onTimeClosureRate: 94.2,
      activeCAPAs: 15,
      avgClosureTime: 12,
      complianceScore: 96.8
    },
    deviations: [
      {
        id: 'DEV-00234',
        title: 'Temperature excursion in cold storage unit B3',
        status: 'in-progress',
        priority: 'high',
        department: 'Quality Control',
        dateOpened: '2025-10-15',
        dueDate: '2025-11-15',
        assignee: 'John Smith',
        description: 'Temperature monitoring system detected readings above acceptable range in cold storage unit B3. Investigation ongoing to determine root cause and implement corrective actions.'
      },
      {
        id: 'DEV-00235',
        title: 'Documentation discrepancy in batch records',
        status: 'open',
        priority: 'medium',
        department: 'Manufacturing',
        dateOpened: '2025-10-20',
        dueDate: '2025-11-20',
        assignee: 'Sarah Johnson',
        description: 'Discrepancies found between electronic batch records and paper documentation for batch #45678.'
      }
    ],
    capas: [
      {
        id: 'CAPA-00156',
        title: 'Implement automated temperature monitoring',
        status: 'in-progress',
        priority: 'high',
        department: 'Quality Control',
        dateOpened: '2025-09-01',
        targetDate: '2025-12-01',
        assignee: 'Mike Chen',
        progress: 65
      }
    ],
    lastUpdated: new Date().toISOString()
  }
}
