/**
 * Power BI Discovery Utility
 * Helper functions to discover Power BI workspaces, datasets, and tables
 * Use this to find the correct IDs for your .env configuration
 */

import { getPowerBIAccessToken, loginForPowerBI } from './powerBIAuth';

const POWERBI_API_BASE = 'https://api.powerbi.com/v1.0/myorg';

export interface PowerBIWorkspace {
  id: string;
  name: string;
  type: string;
  state: string;
}

export interface PowerBIDataset {
  id: string;
  name: string;
  configuredBy: string;
  isRefreshable: boolean;
  workspaceId?: string;
}

export interface PowerBITable {
  name: string;
  columns: string[];
}

/**
 * List all accessible Power BI workspaces
 */
export async function listWorkspaces(): Promise<PowerBIWorkspace[]> {
  const token = await getPowerBIAccessToken();
  
  if (!token) {
    console.error('No access token available. Please sign in first.');
    return [];
  }

  try {
    const response = await fetch(`${POWERBI_API_BASE}/groups`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.value || [];
  } catch (error) {
    console.error('Error listing workspaces:', error);
    return [];
  }
}

/**
 * List all datasets in a workspace
 */
export async function listDatasets(workspaceId: string): Promise<PowerBIDataset[]> {
  const token = await getPowerBIAccessToken();
  
  if (!token) {
    console.error('No access token available. Please sign in first.');
    return [];
  }

  try {
    const response = await fetch(
      `${POWERBI_API_BASE}/groups/${workspaceId}/datasets`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return (data.value || []).map((ds: any) => ({
      ...ds,
      workspaceId
    }));
  } catch (error) {
    console.error('Error listing datasets:', error);
    return [];
  }
}

/**
 * Get tables and columns from a dataset
 */
export async function getDatasetSchema(
  workspaceId: string,
  datasetId: string
): Promise<PowerBITable[]> {
  const token = await getPowerBIAccessToken();
  
  if (!token) {
    console.error('No access token available. Please sign in first.');
    return [];
  }

  try {
    // Execute a simple DAX query to get schema information
    const daxQuery = `
      EVALUATE
      INFO.TABLES()
    `;

    const response = await fetch(
      `${POWERBI_API_BASE}/groups/${workspaceId}/datasets/${datasetId}/executeQueries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          queries: [{ query: daxQuery }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract table information
    if (data.results && data.results[0] && data.results[0].tables && data.results[0].tables[0]) {
      const rows = data.results[0].tables[0].rows || [];
      
      // Get unique table names
      const tableNames = [...new Set(rows.map((row: any) => String(row['[Name]'])))];
      
      // For each table, get its columns
      const tables = await Promise.all(
        tableNames.map(async (tableName: string) => {
          const columns = await getTableColumns(workspaceId, datasetId, tableName);
          return {
            name: tableName,
            columns
          };
        })
      );
      
      return tables;
    }

    return [];
  } catch (error) {
    console.error('Error getting dataset schema:', error);
    return [];
  }
}

/**
 * Get columns for a specific table
 */
async function getTableColumns(
  workspaceId: string,
  datasetId: string,
  tableName: string
): Promise<string[]> {
  const token = await getPowerBIAccessToken();
  
  if (!token) return [];

  try {
    const daxQuery = `
      EVALUATE
      INFO.COLUMNS("${tableName}")
    `;

    const response = await fetch(
      `${POWERBI_API_BASE}/groups/${workspaceId}/datasets/${datasetId}/executeQueries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          queries: [{ query: daxQuery }],
        }),
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    if (data.results && data.results[0] && data.results[0].tables && data.results[0].tables[0]) {
      const rows = data.results[0].tables[0].rows || [];
      return rows.map((row: any) => row['[Name]']);
    }

    return [];
  } catch (error) {
    console.error(`Error getting columns for table ${tableName}:`, error);
    return [];
  }
}

/**
 * Find workspace by name (case-insensitive)
 */
export async function findWorkspaceByName(name: string): Promise<PowerBIWorkspace | null> {
  const workspaces = await listWorkspaces();
  const normalizedName = name.toLowerCase().trim();
  
  return workspaces.find(w => w.name.toLowerCase().includes(normalizedName)) || null;
}

/**
 * Find dataset by name in a workspace (case-insensitive)
 */
export async function findDatasetByName(
  workspaceId: string,
  name: string
): Promise<PowerBIDataset | null> {
  const datasets = await listDatasets(workspaceId);
  const normalizedName = name.toLowerCase().trim();
  
  return datasets.find(d => d.name.toLowerCase().includes(normalizedName)) || null;
}

/**
 * Helper function to discover FDA_483_Response workspace and Executive dashboard
 */
export async function discoverFDA483Configuration(): Promise<{
  workspaceId: string | null;
  datasetId: string | null;
  tables: PowerBITable[];
}> {
  console.log('🔍 Discovering FDA_483_Response configuration...');
  
  // Step 1: Find workspace
  const workspace = await findWorkspaceByName('FDA_483_Response');
  
  if (!workspace) {
    console.error('❌ Could not find FDA_483_Response workspace');
    return { workspaceId: null, datasetId: null, tables: [] };
  }
  
  console.log('✅ Found workspace:', workspace.name, '(ID:', workspace.id + ')');
  
  // Step 2: Find dataset (look for 'executive' or 'dashboard')
  const datasets = await listDatasets(workspace.id);
  const executiveDataset = datasets.find(d => 
    d.name.toLowerCase().includes('executive') || 
    d.name.toLowerCase().includes('dashboard')
  );
  
  if (!executiveDataset) {
    console.warn('⚠️  Could not find Executive Dashboard dataset. Available datasets:');
    datasets.forEach(ds => console.log('  -', ds.name));
    return { workspaceId: workspace.id, datasetId: null, tables: [] };
  }
  
  console.log('✅ Found dataset:', executiveDataset.name, '(ID:', executiveDataset.id + ')');
  
  // Step 3: Get schema
  const tables = await getDatasetSchema(workspace.id, executiveDataset.id);
  
  console.log('✅ Found', tables.length, 'tables:');
  tables.forEach(table => {
    console.log(`  - ${table.name} (${table.columns.length} columns)`);
  });
  
  // Step 4: Check for expected tables
  const deviationTable = tables.find(t => t.name.includes('DEVIATION'));
  const capaTable = tables.find(t => t.name.includes('CAPA'));
  
  if (deviationTable) {
    console.log('✅ Found deviation table:', deviationTable.name);
    console.log('   Columns:', deviationTable.columns.join(', '));
  } else {
    console.warn('⚠️  Could not find DEVIATION table');
  }
  
  if (capaTable) {
    console.log('✅ Found CAPA table:', capaTable.name);
    console.log('   Columns:', capaTable.columns.join(', '));
  } else {
    console.warn('⚠️  Could not find CAPA table');
  }
  
  return {
    workspaceId: workspace.id,
    datasetId: executiveDataset.id,
    tables
  };
}

// Make discovery functions available in browser console for debugging
if (typeof window !== 'undefined') {
  (window as any).powerBIDiscovery = {
    listWorkspaces,
    listDatasets,
    getDatasetSchema,
    findWorkspaceByName,
    findDatasetByName,
    discoverFDA483Configuration,
    loginForPowerBI
  };
  
  console.log('💡 Power BI Discovery utilities available in console:');
  console.log('   - powerBIDiscovery.discoverFDA483Configuration()');
  console.log('   - powerBIDiscovery.listWorkspaces()');
  console.log('   - powerBIDiscovery.loginForPowerBI()');
}
