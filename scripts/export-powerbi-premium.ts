import fs from 'fs';
import path from 'path';

// Tracing for observability (AI Toolkit best practice)
interface TraceEvent {
  timestamp: string;
  operation: string;
  status: 'started' | 'success' | 'error';
  details?: any;
  duration?: number;
}

const traceLog: TraceEvent[] = [];

function trace(operation: string, status: TraceEvent['status'], details?: any, duration?: number) {
  const event: TraceEvent = {
    timestamp: new Date().toISOString(),
    operation,
    status,
    details,
    duration
  };
  traceLog.push(event);
  
  const icon = status === 'success' ? '✅' : status === 'error' ? '❌' : '🔄';
  console.log(`${icon} [${operation}] ${status}${duration ? ` (${duration}ms)` : ''}`);
  if (details && Object.keys(details).length > 0) {
    console.log('   ', JSON.stringify(details, null, 2));
  }
}

function loadPowerBIToken(): string {
  const startTime = Date.now();
  trace('loadPowerBIToken', 'started');
  
  try {
    // Try both .rtf and plain text versions
    let tokenPath = path.join(process.cwd(), 'PBI_read_token.rtf');
    if (!fs.existsSync(tokenPath)) {
      tokenPath = path.join(process.cwd(), 'PBI_read_token');
    }
    
    if (!fs.existsSync(tokenPath)) {
      throw new Error(`Token file not found. Looked for: PBI_read_token.rtf or PBI_read_token`);
    }
    
    let tokenContent = fs.readFileSync(tokenPath, 'utf-8');
    
    // If it's RTF, extract plain text (simple extraction for JWT tokens)
    let token = tokenContent.trim();
    if (tokenPath.endsWith('.rtf')) {
      // Extract JWT token from RTF content (JWT tokens start with eyJ)
      const jwtMatch = tokenContent.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
      if (jwtMatch) {
        token = jwtMatch[0];
      } else {
        throw new Error('Could not find JWT token in RTF file');
      }
    }
    
    if (!token) {
      throw new Error('Token file is empty');
    }
    
    // Validate JWT format
    if (!token.startsWith('eyJ')) {
      throw new Error('Invalid token format (should start with "eyJ")');
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format (should have 3 parts)');
    }
    
    // Decode and validate expiry
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      const expiryDate = new Date(payload.exp * 1000);
      const now = new Date();
      
      if (expiryDate < now) {
        throw new Error(`Token expired on ${expiryDate.toLocaleString()}`);
      }
      
      const duration = Date.now() - startTime;
      trace('loadPowerBIToken', 'success', {
        tokenLength: token.length,
        user: payload.upn || payload.unique_name || 'N/A',
        expiresAt: expiryDate.toISOString()
      }, duration);
      
      console.log(`   📋 Token info:`);
      console.log(`      User: ${payload.upn || payload.unique_name}`);
      console.log(`      Expires: ${expiryDate.toLocaleString()}`);
      console.log(`      Time remaining: ${Math.floor((expiryDate.getTime() - now.getTime()) / 1000 / 60)} minutes`);
      
    } catch (decodeError) {
      console.warn('   ⚠️  Could not decode token payload (but will try to use it anyway)');
    }
    
    return token;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    trace('loadPowerBIToken', 'error', { 
      error: error instanceof Error ? error.message : String(error) 
    }, duration);
    throw error;
  }
}

interface PowerBIWorkspace {
  id: string;
  name: string;
  isReadOnly?: boolean;
  isOnDedicatedCapacity?: boolean;
  capacityId?: string;
}

interface PowerBIReport {
  id: string;
  name: string;
  datasetId: string;
  webUrl: string;
}

interface PowerBIDataset {
  id: string;
  name: string;
  addRowsAPIEnabled?: boolean;
  configuredBy?: string;
}

interface PowerBITable {
  name: string;
  columns?: Array<{ name: string; dataType: string }>;
}

interface DAXQueryResult {
  results: Array<{
    tables: Array<{
      rows: any[];
    }>;
  }>;
}

class PowerBIClient {
  private accessToken: string;
  private baseUrl = 'https://api.powerbi.com/v1.0/myorg';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getWorkspaces(): Promise<PowerBIWorkspace[]> {
    const startTime = Date.now();
    trace('getWorkspaces', 'started');
    
    try {
      const response = await fetch(`${this.baseUrl}/groups`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      
      trace('getWorkspaces', 'success', { count: data.value.length }, duration);
      return data.value;
    } catch (error) {
      trace('getWorkspaces', 'error', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async getReportsInWorkspace(workspaceId: string): Promise<PowerBIReport[]> {
    const startTime = Date.now();
    trace('getReportsInWorkspace', 'started', { workspaceId });
    
    try {
      const response = await fetch(
        `${this.baseUrl}/groups/${workspaceId}/reports`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      
      trace('getReportsInWorkspace', 'success', { count: data.value.length }, duration);
      return data.value;
    } catch (error) {
      trace('getReportsInWorkspace', 'error', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async getDatasets(workspaceId: string): Promise<PowerBIDataset[]> {
    const startTime = Date.now();
    trace('getDatasets', 'started', { workspaceId });
    
    try {
      const response = await fetch(
        `${this.baseUrl}/groups/${workspaceId}/datasets`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      
      trace('getDatasets', 'success', { count: data.value.length }, duration);
      return data.value;
    } catch (error) {
      trace('getDatasets', 'error', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async getDatasetTables(workspaceId: string, datasetId: string): Promise<PowerBITable[]> {
    const startTime = Date.now();
    trace('getDatasetTables', 'started', { workspaceId, datasetId });
    
    try {
      const response = await fetch(
        `${this.baseUrl}/groups/${workspaceId}/datasets/${datasetId}/tables`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      
      trace('getDatasetTables', 'success', { count: data.value.length }, duration);
      return data.value;
    } catch (error) {
      trace('getDatasetTables', 'error', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async executeDAXQuery(
    workspaceId: string,
    datasetId: string,
    daxQuery: string
  ): Promise<DAXQueryResult> {
    const startTime = Date.now();
    trace('executeDAXQuery', 'started', { 
      workspaceId, 
      datasetId
    });
    
    try {
      const response = await fetch(
        `${this.baseUrl}/groups/${workspaceId}/datasets/${datasetId}/executeQueries`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            queries: [{ query: daxQuery }],
            serializerSettings: { includeNulls: true }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      
      const rowCount = data.results?.[0]?.tables?.[0]?.rows?.length || 0;
      trace('executeDAXQuery', 'success', { rowCount }, duration);
      
      return data;
    } catch (error) {
      trace('executeDAXQuery', 'error', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }
}

async function exportPowerBIData() {
  const overallStart = Date.now();
  trace('exportPowerBIData', 'started');

  try {
    // Load access token from file
    console.log('\n🔐 Step 1: Loading Access Token from PBI_read_token file');
    const accessToken = loadPowerBIToken();
    
    const client = new PowerBIClient(accessToken);

    // Get workspaces
    console.log('\n📂 Step 2: Fetching Workspaces');
    const workspaces = await client.getWorkspaces();
    
    console.log(`\nFound ${workspaces.length} workspaces:`);
    workspaces.forEach((ws, idx) => {
      console.log(`   ${idx + 1}. ${ws.name} (${ws.id})`);
    });
    
    // Target specific report: FDA_483_Response
    const TARGET_REPORT_NAME = 'FDA_483_Response';

    // Find target workspace
    const targetWorkspaceName = process.env.POWERBI_WORKSPACE_NAME || 'PBI_RD_SPC_CDI';
    let targetWorkspace = workspaces.find(ws => ws.name === targetWorkspaceName);

    if (!targetWorkspace) {
      console.log(`\n⚠️  Workspace "${targetWorkspaceName}" not found.`);
      console.log('Using first workspace for analysis.');
      
      if (workspaces.length > 0) {
        targetWorkspace = workspaces[0];
      } else {
        throw new Error('No workspaces available');
      }
    }

    console.log(`\n✅ Using workspace: ${targetWorkspace.name}`);

    // Get reports in workspace
    console.log('\n📊 Step 3: Fetching Reports');
    const reports = await client.getReportsInWorkspace(targetWorkspace.id);
    
    console.log(`\nFound ${reports.length} reports:`);
    reports.forEach((report, idx) => {
      console.log(`   ${idx + 1}. ${report.name}`);
      console.log(`      Dataset ID: ${report.datasetId}`);
      console.log(`      URL: ${report.webUrl}`);
    });

    // Find FDA_483_Response report
    const targetReport = reports.find(r => r.name === TARGET_REPORT_NAME);
    if (!targetReport) {
      throw new Error(`Report "${TARGET_REPORT_NAME}" not found in workspace`);
    }
    
    console.log(`\n✅ Found target report: ${targetReport.name}`);
    console.log(`   Dataset ID: ${targetReport.datasetId}`);

    // Get datasets in workspace
    console.log('\n📊 Step 4: Fetching Datasets');
    const datasets = await client.getDatasets(targetWorkspace.id);
    
    console.log(`\nFound ${datasets.length} datasets:`);
    datasets.forEach((dataset, idx) => {
      console.log(`   ${idx + 1}. ${dataset.name} (${dataset.id})`);
    });

    // Find the dataset for FDA_483_Response report
    const targetDataset = datasets.find(ds => ds.id === targetReport.datasetId);
    if (!targetDataset) {
      throw new Error(`Dataset not found for report "${TARGET_REPORT_NAME}"`);
    }

    console.log(`\n✅ Using dataset: ${targetDataset.name} (${targetDataset.id})`);

    // Discover tables using DAX metadata query
    console.log('\n🔍 Step 5: Discovering Dataset Schema via DAX');
    
    let discoveredTables: string[] = [];
    
    try {
      // Query DMV (Dynamic Management Views) to get table list
      const schemaQuery = `
        EVALUATE
        SELECTCOLUMNS(
          INFO.TABLES(),
          "TableName", [Name]
        )
      `;
      
      console.log('   Querying INFO.TABLES() for schema discovery...');
      const schemaResult = await client.executeDAXQuery(
        targetWorkspace.id,
        targetDataset.id,
        schemaQuery
      );
      
      if (schemaResult.results?.[0]?.tables?.[0]?.rows) {
        discoveredTables = schemaResult.results[0].tables[0].rows.map((row: any) => row['[TableName]']);
        console.log(`   ✅ Discovered ${discoveredTables.length} tables:`);
        discoveredTables.forEach((tableName, idx) => {
          console.log(`      ${idx + 1}. ${tableName}`);
        });
      }
    } catch (error) {
      console.log(`   ⚠️  Schema discovery failed: ${error instanceof Error ? error.message : String(error)}`);
      console.log('   Will attempt to query common table names...');
      
      // Fallback: try common FDA 483 response table names
      discoveredTables = [
        'FDA_483_Response',
        'Observations',
        'Responses',
        'Actions',
        'CAPA',
        'Timeline',
        'Status',
        'Documents'
      ];
    }

    // Execute queries to extract all data
    console.log('\n📈 Step 6: Extracting All Visible Data from FDA_483_Response');

    let analyticsData: any = {
      metadata: {
        workspace: targetWorkspace.name,
        workspaceId: targetWorkspace.id,
        dataset: targetDataset.name,
        datasetId: targetDataset.id,
        report: targetReport.name,
        reportUrl: targetReport.webUrl,
        discoveredTables: discoveredTables,
        lastUpdated: new Date().toISOString(),
        source: 'Power BI Premium via REST API (PBI_read_token)'
      },
      tables: {}
    };

    // Query each discovered table
    for (const tableName of discoveredTables) {
      try {
        console.log(`\n   📊 Querying table: ${tableName}...`);
        
        // Try to get all rows (limit to 1000 for safety)
        const dataQuery = `
          EVALUATE
          TOPN(1000, '${tableName}')
        `;
        
        const result = await client.executeDAXQuery(
          targetWorkspace.id,
          targetDataset.id,
          dataQuery
        );

        if (result.results?.[0]?.tables?.[0]?.rows) {
          const rows = result.results[0].tables[0].rows;
          const columns = Object.keys(rows[0] || {}).map(k => k.replace(/^\[|\]$/g, ''));
          
          analyticsData.tables[tableName] = {
            rowCount: rows.length,
            columns: columns,
            data: rows
          };
          
          console.log(`      ✅ Retrieved ${rows.length} rows with ${columns.length} columns`);
          console.log(`      Columns: ${columns.join(', ')}`);
          
          // Show first row as preview
          if (rows.length > 0) {
            console.log(`      Preview (first row):`);
            const preview = Object.entries(rows[0]).slice(0, 5);
            preview.forEach(([key, value]) => {
              console.log(`         ${key}: ${JSON.stringify(value)}`);
            });
            if (Object.keys(rows[0]).length > 5) {
              console.log(`         ... and ${Object.keys(rows[0]).length - 5} more columns`);
            }
          }
        }
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.log(`      ⚠️  Could not query ${tableName}: ${errorMsg}`);
        
        // Only add to results if it's not a "table not found" error
        if (!errorMsg.includes('find') && !errorMsg.includes('not exist')) {
          analyticsData.tables[tableName] = { 
            error: errorMsg,
            attempted: true 
          };
        }
      }
    }

    // Add trace log
    analyticsData.trace = traceLog;

    // Save to file
    console.log('\n💾 Step 7: Saving Data');
    const outputPath = path.join(process.cwd(), 'src/data/powerbi-analytics.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(analyticsData, null, 2));

    const overallDuration = Date.now() - overallStart;
    trace('exportPowerBIData', 'success', { 
      outputPath,
      totalDuration: overallDuration 
    });

    console.log(`\n✅ SUCCESS! Data exported to: ${outputPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - Workspace: ${targetWorkspace.name}`);
    console.log(`   - Report: ${targetReport.name}`);
    console.log(`   - Dataset: ${targetDataset.name}`);
    console.log(`   - Tables discovered: ${discoveredTables.length}`);
    console.log(`   - Tables with data: ${Object.keys(analyticsData.tables).length}`);
    console.log(`   - Total execution time: ${overallDuration}ms`);
    
    // Save trace log
    const traceLogPath = path.join(process.cwd(), 'logs/powerbi-export-trace.json');
    fs.mkdirSync(path.dirname(traceLogPath), { recursive: true });
    fs.writeFileSync(traceLogPath, JSON.stringify(traceLog, null, 2));
    console.log(`\n📝 Trace log saved to: ${traceLogPath}`);

  } catch (error) {
    trace('exportPowerBIData', 'error', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    console.error('\n❌ Export failed:', error);
    
    // Save trace log even on failure
    const traceLogPath = path.join(process.cwd(), 'logs/powerbi-export-trace-error.json');
    fs.mkdirSync(path.dirname(traceLogPath), { recursive: true });
    fs.writeFileSync(traceLogPath, JSON.stringify(traceLog, null, 2));
    console.log(`\n📝 Error trace log saved to: ${traceLogPath}`);
    
    throw error;
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  exportPowerBIData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { exportPowerBIData };
