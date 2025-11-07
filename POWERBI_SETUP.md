# Power BI Integration Setup Guide

This guide explains how to configure the AI-COMPASS application to connect directly to Power BI FDA_483_Response workspace using REST API.

## Prerequisites

1. Access to Sanofi Azure AD tenant
2. Access to Power BI FDA_483_Response workspace
3. Power BI Pro or Premium license

## Step 1: Azure AD App Registration

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Go to **Azure Active Directory** > **App registrations** > **New registration**
3. Configure the application:
   - **Name**: AI-COMPASS-PowerBI
   - **Supported account types**: Accounts in this organizational directory only (Sanofi only)
   - **Redirect URI**: 
     - Type: Single-page application (SPA)
     - URI: `http://localhost:5173` (for local development)
     - Add production URL when deploying

4. After registration, note down:
   - **Application (client) ID**
   - **Directory (tenant) ID**

5. Configure API permissions:
   - Click **API permissions** > **Add a permission**
   - Select **Power BI Service**
   - Add these delegated permissions:
     - `Dataset.Read.All`
     - `Dataset.ReadWrite.All`
     - `Workspace.Read.All`
   - Click **Grant admin consent** (requires admin rights)

## Step 2: Get Power BI Workspace and Dataset IDs

### Data Source Information:

**Snowflake Database:**
- Server: `sanofi-emea_df_ia.snowflakecomputing.com`
- Warehouse: `EMEA_DF_IA_CWH_12`
- Database: `QUALITY_MANAGEMENT_PROD`
- Schema: `PBL_QMS`

**Primary Table:**
- `DEVIATION_LI` (Deviation and Lab Investigation records)

**Related Tables:**
- `THIRD_PARTY_COMPLAINT` (TPE tracking)
- `EXTENSION_REQUEST_ALL` (Due date extensions)

### Using Power BI Web Portal:

1. Navigate to [Power BI Service](https://app.powerbi.com)
2. Go to your **FDA_483_Response** workspace
3. The workspace ID is in the URL:
   ```
   https://app.powerbi.com/groups/{WORKSPACE_ID}/...
   ```

4. Open the **Executive dashboard** report
5. Go to the dataset settings (click the three dots on the dataset)
6. The dataset ID is in the URL or settings panel

### Using Power BI REST API (Alternative):

```bash
# Get workspace ID
GET https://api.powerbi.com/v1.0/myorg/groups
# Look for "FDA_483_Response" in the response

# Get dataset ID
GET https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/datasets
# Look for the dataset associated with "Executive dashboard 1-2"
```

## Step 3: Configure Environment Variables

Update the `.env` file in the project root:

```env
# Azure AD Configuration
VITE_AZURE_CLIENT_ID=<your-app-client-id-from-step-1>
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/<your-tenant-id-from-step-1>
VITE_REDIRECT_URI=http://localhost:5173

# Power BI Configuration
VITE_POWERBI_WORKSPACE_ID=<your-workspace-id-from-step-2>
VITE_POWERBI_DATASET_ID=<your-dataset-id-from-step-2>
```

## Step 4: Verify Table Names

Ensure the Power BI dataset contains this table:
- `DEVIATION_LI` - Combined Deviation and Lab Investigation records from Snowflake

**Note:** The current implementation uses a single unified table (`DEVIATION_LI`) that contains both deviation and lab investigation data, filtered by `QUALITY_EVENT_TYPE`.

If your table has a different name, update it in `src/services/qmsDataService.ts`:

```typescript
const DEVIATION_TABLE = 'DEVIATION_LI'; // Update if needed
```

### Key Columns in DEVIATION_LI:

**Identification:**
- `EVENT_UID` - Unique identifier
- `EVENT_NAME` - Event number (e.g., NBOD23E0073)
- `EVENT_SHORT_UID` - Short UID for Veeva Vault links
- `QUALITY_EVENT_TYPE` - "Lab Investigation" or deviation type

**Status & Classification:**
- `STATUS` - Current status
- `STATE` - Workflow state
- `CLASSIFICATION` - "Significant" or "Non Significant"
- `SOURCE_STATUS` - Original status from source system
- `SOURCE_CLASSIFICATION` - Source classification (includes "Minor5W2H")
- `NEW_PHENIX_STATUS` - PHENIX system override logic

**Dates:**
- `CREATED_TS` - Creation timestamp
- `DETECTION_TS` - Detection timestamp
- `DUE_DATE_TS` - Original due date
- `EXTENDED_DUE_DATE_TS` - Extended due date (if applicable)
- `CLOSED_TS` - Closure timestamp
- `OVERALL_INVESTIGATION_END_TS` - Investigation end timestamp
- `QA_Closure Calendar` - Calculated QA closure date

**Assignment:**
- `OWNER` - Deviation owner (for Non Significant)
- `INVESTIGATOR_LEADER` - Investigation leader (for Significant)
- `QUALITY_APPROVER` - QA approver
- `ASSIGNED_PERSON` - Calculated responsible person

**Location & Organization:**
- `OWNING_ENTITY` - Site (MA BioCampus, Framingham Biologics, etc.)
- `DEPARTMENT` - Department
- `DEPARTMENT_OWNING_ENTITY` - Department owning entity
- `DEPARTMENT_TRUE_UP` - Calculated true-up department
- `OWNING_GROUP` - Calculated owning group (8NYA, 76NYA, etc.)
- `SUB_DEPARTMENT` - Sub-department
- `BUILDING` - Building location
- `OPERATION` - Operation type (Environmental Monitoring, Utilities Monitoring, etc.)

**Details:**
- `TITLE` - Event title
- `DESCRIPTION` - Event description
- `SOURCE_SYSTEM` - "PHENIX" or "QUALIPSO"
- `PREVIOUS_ID` - Previous system ID

**Timeliness:**
- `Deviation timeliness - Current Due Date` - Calculated timeliness status
- `Deviation timeliness - Original due date` - Original due date timeliness
- `Current Due_Date Age` - Days from current due date
- `Original DueDate Age` - Days from original due date
- `Age` - Conditional age calculation

**Third Party Complaints:**
- `Third Party Complaint?` - TPE summary with count and details

**Extensions:**
- `EXTENSION?` - "Yes" or "No"
- `EXTENSION_REQUEST_ALL.Count` - Number of extension requests

**URLs:**
- `EVENT_URL` - Veeva Vault link (https://sanofi-qualipso.veevavault.com/ui/#t/...)

### Calculated Fields Used in QMS Dashboard:

**Timeliness Logic:**
```
- "Closed On-Time" - Closed before/on original due date
- "Closed Late" - Closed after original due date
- "Current Ongoing On-Time" - Open and not yet due
- "Current Ongoing Late" - Open and overdue
- "OnGoing - No Due Date" - Open without due date
- "Cancelled" - Cancelled state
- "Rejected" - Rejected status
```

**QA Closure Condition:**
```
- "Close" - Investigation ended or closed
- "Open" - Still in progress
- "Cancelled" - Cancelled
- "Rejected" - Rejected
```

**Lab Investigation Phases:**
```
- "Phase I" - Initial investigation
- "Phase II" - Extended investigation
- "Closed LI" - Closed lab investigation
- "Initiated LI" - Newly initiated
- "In Final Approval LI" - Awaiting approval
```

## Step 5: Test the Connection

1. Restart the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the QMS page in the application

3. On first load, you'll be prompted to sign in with your Sanofi credentials

4. After authentication, the application will fetch real-time data from Power BI

## Expected Column Names

The service expects these columns in the Power BI table:

### DEVIATION_LI Table (Primary Table):

**Core Identification:**
- `EVENT_UID` - Unique identifier (PRIMARY KEY)
- `EVENT_NAME` - Event number
- `EVENT_SHORT_UID` - Short identifier
- `QUALITY_EVENT_TYPE` - Event type ("Lab Investigation" or deviation type)

**Status & Classification:**
- `STATUS` - Current status
- `STATE` - Workflow state (cancelled_state__c, archived_state__c, etc.)
- `CLASSIFICATION` - "Significant" or "Non Significant"
- `SOURCE_STATUS` - Original source status
- `SOURCE_CLASSIFICATION` - Source classification
- `NEW_PHENIX_STATUS` - PHENIX override status

**Dates (All timestamp fields):**
- `CREATED_TS` - Creation date
- `DETECTION_TS` - Detection date
- `DUE_DATE_TS` - Original due date
- `EXTENDED_DUE_DATE_TS` - Extended due date
- `CLOSED_TS` - Closure date
- `OVERALL_INVESTIGATION_END_TS` - Investigation end date

**People:**
- `OWNER` - Owner (for Non Significant deviations)
- `INVESTIGATOR_LEADER` - Investigator (for Significant deviations)
- `QUALITY_APPROVER` - QA approver
- `ASSIGNED_PERSON` - Calculated responsible person

**Location:**
- `OWNING_ENTITY` - Site (MA BioCampus, Framingham Biologics, Framingham Biosurgery, Northborough)
- `DEPARTMENT` - Department
- `DEPARTMENT_OWNING_ENTITY` - Department entity
- `DEPARTMENT_TRUE_UP` - Calculated department
- `OWNING_GROUP` - Calculated group (8NYA, 76NYA, 45/51NYA, etc.)
- `SUB_DEPARTMENT` - Sub-department
- `BUILDING` - Building name
- `OPERATION` - Operation type

**Content:**
- `TITLE` - Event title
- `DESCRIPTION` - Event description
- `QA_COMMENT` - QA comments

**System:**
- `SOURCE_SYSTEM` - "PHENIX" or "QUALIPSO"
- `PREVIOUS_ID` - Previous system ID
- `EVENT_URL` - Veeva Vault URL

**Calculated Fields (from M Query):**
- `Deviation timeliness - Current Due Date` - Current timeliness status
- `Deviation timeliness - Original due date` - Original timeliness status
- `Current Due_Date Age` - Days from current due date
- `Original DueDate Age` - Days from original due date
- `Age` - Conditional age
- `QA_Open_Close_Condition` - "Open", "Close", "Cancelled", "Rejected"
- `Third Party Complaint?` - TPE summary
- `EXTENSION?` - "Yes" or "No"
- `EXTENSION_REQUEST_ALL.Count` - Extension count
- `Lab_Investigation_Phase` - "Phase I", "Phase II", etc.
- `QA_Closure Calendar` - Calculated closure date
- `24_Hours_FromCreated` - Within/Over 24 hours
- `72_Hours_FromCreated` - Within/Over 72 hours
- `IsOnOrBeforeToday_CurrentDueDate` - "Yes" or "No"
- `IsOnOrBeforeToday_OriginalDueDate` - "Yes" or "No"

**Note:** The service includes flexible column name matching and will work with variations of these names.

## Troubleshooting

### Authentication Issues

**Problem**: "No Power BI access token available"
- **Solution**: Ensure you've granted admin consent for API permissions in Azure AD
- **Solution**: Clear browser cache and try logging in again

### Data Not Loading

**Problem**: "Power BI API error: 403 Forbidden"
- **Solution**: Verify you have access to the FDA_483_Response workspace
- **Solution**: Check that API permissions include `Dataset.Read.All`

**Problem**: "Power BI API error: 404 Not Found"
- **Solution**: Verify workspace ID and dataset ID are correct
- **Solution**: Ensure the dataset exists in the specified workspace

### Missing Data

**Problem**: KPI cards show zeros or mock data
- **Solution**: Check that table names match exactly (case-sensitive)
- **Solution**: Verify tables contain data with the expected column names
- **Solution**: Check browser console for detailed error messages

## Security Considerations

1. **Never commit** `.env` file to version control
2. The `.env.example` file shows the required structure without sensitive values
3. For production deployment:
   - Use environment variables in your hosting platform (Vercel, Azure, etc.)
   - Update redirect URI to your production domain
   - Consider using Azure Key Vault for sensitive credentials

## Performance Notes

- The service fetches up to 1000 rows from each table (configurable via TOPN in DAX query)
- Data is cached in browser during the session
- For better performance, consider implementing:
  - Incremental refresh (fetch only changed records)
  - Server-side caching layer
  - Background sync with local storage

## Power BI API Rate Limits

- Free/Pro: 200 requests per hour per user
- Premium: Higher limits, contact Microsoft for details
- Consider implementing retry logic with exponential backoff
- Cache data locally to minimize API calls

## Additional Resources

- [Power BI REST API Documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/)
- [Azure AD App Registration Guide](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)

## Support

For issues specific to:
- **Power BI access**: Contact your Power BI workspace administrator
- **Azure AD**: Contact your IT department or Azure administrator
- **Application setup**: Refer to this guide or check the GitHub repository
