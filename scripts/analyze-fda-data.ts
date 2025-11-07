import fs from 'fs';
import path from 'path';

// Analyze the FDA_483_Response data export
const dataPath = path.join(process.cwd(), 'src/data/powerbi-analytics.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);

console.log('\n📊 FDA_483_Response Dashboard Analysis\n');
console.log('=' .repeat(80));

// Metadata
console.log('\n📋 Metadata:');
console.log(`   Workspace: ${data.metadata.workspace}`);
console.log(`   Report: ${data.metadata.report}`);
console.log(`   Dataset: ${data.metadata.dataset}`);
console.log(`   Report URL: ${data.metadata.reportUrl}`);
console.log(`   Last Updated: ${data.metadata.lastUpdated}`);
console.log(`   Total Tables: ${data.metadata.discoveredTables.length}`);

// Key business tables (exclude LocalDateTables)
const businessTables = Object.keys(data.tables).filter(
  name => !name.startsWith('LocalDateTable_')
);

console.log('\n📊 Key Business Tables:');
console.log(`   Found ${businessTables.length} business tables\n`);

// Analyze each business table
for (const tableName of businessTables) {
  const table = data.tables[tableName];
  
  if (table.error) {
    console.log(`   ⚠️  ${tableName}: Error - ${table.error}`);
    continue;
  }
  
  console.log(`   ✅ ${tableName}`);
  console.log(`      - Rows: ${table.rowCount}`);
  console.log(`      - Columns: ${table.columns.length}`);
  console.log(`      - Sample Columns: ${table.columns.slice(0, 10).join(', ')}${table.columns.length > 10 ? '...' : ''}`);
  
  // Show sample data for key tables
  if (table.data && table.data.length > 0) {
    const sampleRow = table.data[0];
    const preview = Object.entries(sampleRow)
      .slice(0, 3)
      .map(([key, value]) => {
        const cleanKey = key.replace(/^\[|\]$/g, '').split('[').pop();
        const cleanValue = typeof value === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
        return `${cleanKey}: ${JSON.stringify(cleanValue)}`;
      })
      .join(', ');
    console.log(`      - Sample: ${preview}`);
  }
  
  console.log('');
}

// Data statistics
console.log('\n📈 Data Statistics:');
let totalRows = 0;
let totalColumns = 0;

for (const table of Object.values(data.tables)) {
  if (!(table as any).error) {
    totalRows += (table as any).rowCount || 0;
    totalColumns += (table as any).columns?.length || 0;
  }
}

console.log(`   Total Rows Extracted: ${totalRows.toLocaleString()}`);
console.log(`   Total Columns: ${totalColumns}`);
console.log(`   File Size: ${(rawData.length / 1024 / 1024).toFixed(2)} MB`);

// Key insights
console.log('\n🔍 Key Insights:');
const deviationTable = data.tables['DEVIATION_LI_HR'];
if (deviationTable && !deviationTable.error) {
  console.log(`   - ${deviationTable.rowCount} deviation records tracked`);
  console.log(`   - ${deviationTable.columns.length} fields per deviation`);
}

const owningGroupTable = data.tables['OWNING_GROUP'];
if (owningGroupTable && !owningGroupTable.error) {
  console.log(`   - ${owningGroupTable.rowCount} organizational groups`);
}

const qeSnapshotsTable = data.tables['QE DAILY SNAPSHOTS APU'];
if (qeSnapshotsTable && !qeSnapshotsTable.error) {
  console.log(`   - ${qeSnapshotsTable.rowCount} quality snapshots with ${qeSnapshotsTable.columns.length} metrics`);
}

const identifierTable = data.tables['Identifier naming'];
if (identifierTable && !identifierTable.error) {
  console.log(`   - ${identifierTable.rowCount} identifiers tracked`);
}

const capaGroupTable = data.tables['CAPA OWNING GROUP'];
if (capaGroupTable && !capaGroupTable.error) {
  console.log(`   - ${capaGroupTable.rowCount} CAPA actions mapped`);
}

const ccrTable = data.tables['CCR_OwningGroup_Manual'];
if (ccrTable && !ccrTable.error) {
  console.log(`   - ${ccrTable.rowCount} change control records`);
}

console.log('\n' + '='.repeat(80));
console.log('\n✅ Analysis Complete!\n');
