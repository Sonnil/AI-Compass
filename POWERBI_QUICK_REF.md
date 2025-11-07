# Power BI Quick Reference

## Browser Console Commands

Once you're on the QMS page, open the browser console (F12) and use these commands:

### Discover Configuration
```javascript
// Automatically find FDA_483_Response workspace and dataset
powerBIDiscovery.discoverFDA483Configuration()
```

### List Workspaces
```javascript
// Show all accessible Power BI workspaces
powerBIDiscovery.listWorkspaces()
```

### List Datasets
```javascript
// Show all datasets in a workspace
powerBIDiscovery.listDatasets('workspace-id-here')
```

### Get Dataset Schema
```javascript
// View tables and columns in a dataset
powerBIDiscovery.getDatasetSchema('workspace-id', 'dataset-id')
```

### Find by Name
```javascript
// Find workspace by name
powerBIDiscovery.findWorkspaceByName('FDA_483_Response')

// Find dataset by name
powerBIDiscovery.findDatasetByName('workspace-id', 'executive')
```

### Login
```javascript
// Trigger Power BI authentication popup
powerBIDiscovery.loginForPowerBI()
```

## Environment Variables

Add these to your `.env` file:

```env
# From Azure AD App Registration
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_REDIRECT_URI=http://localhost:5173

# From Power BI (use discovery commands above to find these)
VITE_POWERBI_WORKSPACE_ID=your-workspace-id
VITE_POWERBI_DATASET_ID=your-dataset-id
```

## Expected Data Structure

### DEVIATION_LI_HR Table
Columns: DEVIATION_ID, STATUS, PRIORITY, DEPARTMENT, OPENED_DATE, DUE_DATE, ASSIGNEE, TITLE, DESCRIPTION, ROOT_CAUSE, CORRECTIVE_ACTION

### CAPA_Snowflake Table
Columns: CAPA_ID, STATUS, PRIORITY, DEPARTMENT, OPENED_DATE, TARGET_DATE, COMPLETION_DATE, ASSIGNEE, TITLE, EFFECTIVENESS

## Troubleshooting

### No data showing?
1. Check console for errors
2. Verify authentication: `powerBIDiscovery.loginForPowerBI()`
3. Run discovery: `powerBIDiscovery.discoverFDA483Configuration()`
4. Ensure `.env` file has correct IDs

### 403 Forbidden?
- Grant admin consent in Azure AD for Power BI API permissions
- Verify you have access to the workspace

### 404 Not Found?
- Double-check workspace ID and dataset ID
- Run `powerBIDiscovery.listWorkspaces()` to verify access

## See Full Documentation
[POWERBI_SETUP.md](./POWERBI_SETUP.md)
