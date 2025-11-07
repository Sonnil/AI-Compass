# Power BI DAX Queries Reference

This document describes the DAX measures used in the FDA_483_Response Power BI dashboard for calculating deviation and lab investigation metrics.

## Data Source

**Snowflake Database:**
- Server: `sanofi-emea_df_ia.snowflakecomputing.com`
- Warehouse: `EMEA_DF_IA_CWH_12`
- Database: `QUALITY_MANAGEMENT_PROD`
- Schema: `PBL_QMS`
- Table: `DEVIATION_LI`

**Filtered Sites:**
- MA BioCampus
- Framingham Biosurgery
- Framingham Biologics
- Northborough

## Key Calculated Columns

### Effective Due Date
Determines which due date to use (extended or original):

```dax
Effective Due = 
VAR Ext = DEVIATION_LI[EXTENDED_DUE_DATE_TS]
VAR Orig = DEVIATION_LI[DUE_DATE_TS]
RETURN COALESCE(Ext, Orig)
```

### Timeliness (Original Due)
Categorizes records by their timeliness status:

```dax
Timeliness (Original Due) = 
SWITCH( TRUE(),
  NOT ISBLANK(DEVIATION_LI[QA_CLOSED_AT]) 
    AND NOT ISBLANK([Effective Due]) 
    AND DEVIATION_LI[QA_CLOSED_AT] <= [Effective Due], 
    "Closed On-Time",
    
  NOT ISBLANK(DEVIATION_LI[QA_CLOSED_AT]) 
    AND ( ISBLANK([Effective Due]) 
      OR DEVIATION_LI[QA_CLOSED_AT] > [Effective Due] ), 
    "Closed Late",
    
  ISBLANK(DEVIATION_LI[QA_CLOSED_AT]) 
    AND ISBLANK([Effective Due]), 
    "OnGoing - No Due Date",
    
  ISBLANK(DEVIATION_LI[QA_CLOSED_AT]) 
    AND TODAY() <= [Effective Due], 
    "Current Ongoing On-Time",
    
  ISBLANK(DEVIATION_LI[QA_CLOSED_AT]) 
    AND TODAY() > [Effective Due], 
    "Current Ongoing Late"
)
```

## Deviation Metrics

Deviations exclude Lab Investigations (`QUALITY_EVENT_TYPE <> "Lab Investigation"`).

### Intake Metrics

**Deviation Intake** - Total active deviations (excluding cancelled/rejected):
```dax
Deviation Intake = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] <> "Lab Investigation",
  NOT ( [Timeliness (Original Due)] IN { "Cancelled", "Rejected" } )
)
```

**Deviation Cancelled**:
```dax
Deviation Cancelled = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] <> "Lab Investigation",
  [Timeliness (Original Due)] = "Cancelled"
)
```

**Deviation Rejected**:
```dax
Deviation Rejected = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] <> "Lab Investigation",
  [Timeliness (Original Due)] = "Rejected"
)
```

**Deviation Cancel or Reject**:
```dax
Deviation Cancel or Reject = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] <> "Lab Investigation",
  [Timeliness (Original Due)] IN { "Cancelled", "Rejected" }
)
```

### Work In Progress (WIP) Metrics

**Deviation WIP Total** - Open deviations:
```dax
Deviation WIP Total = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] <> "Lab Investigation",
  ISBLANK(DEVIATION_LI[QA_CLOSED_AT]),
  NOT ( [Timeliness (Original Due)] IN { "Cancelled", "Rejected" } )
)
```

**Deviation WIP On-Time**:
```dax
Deviation WIP On-Time = 
CALCULATE(
  [Deviation WIP Total],
  [Timeliness (Original Due)] = "Current Ongoing On-Time"
)
```

**Deviation WIP Late** (Backlog):
```dax
Deviation WIP Late = 
CALCULATE(
  [Deviation WIP Total],
  [Timeliness (Original Due)] = "Current Ongoing Late"
)
```

**Deviation WIP No Due Date**:
```dax
Deviation WIP No Due = 
CALCULATE(
  [Deviation WIP Total],
  [Timeliness (Original Due)] = "OnGoing - No Due Date"
)
```

**Deviation Backlog** (same as WIP Late):
```dax
Deviation Backlog = [Deviation WIP Late]
```

### Closed Metrics

**Deviation Closed Total**:
```dax
Deviation Closed Total = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] <> "Lab Investigation",
  NOT ISBLANK(DEVIATION_LI[QA_CLOSED_AT]),
  NOT ( [Timeliness (Original Due)] IN { "Cancelled", "Rejected" } )
)
```

**Deviation Closed On-Time**:
```dax
Deviation Closed On-Time = 
CALCULATE(
  [Deviation Closed Total],
  [Timeliness (Original Due)] = "Closed On-Time"
)
```

**Deviation Closed Late**:
```dax
Deviation Closed Late = 
CALCULATE(
  [Deviation Closed Total],
  [Timeliness (Original Due)] = "Closed Late"
)
```

**Deviation Closed (Including Cancel/Reject)**:
```dax
Deviation Closed Including Cancel Reject = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] <> "Lab Investigation",
  NOT ISBLANK(DEVIATION_LI[QA_CLOSED_AT])
)
```

### Third Party Event (TPE) Metrics

**Deviation WIP with TPE**:
```dax
Deviation WIP with TPE = 
CALCULATE(
  [Deviation WIP Total],
  DEVIATION_LI[EVENT_TYPE] = "TPE"
)
```

**Deviation Backlog with TPE**:
```dax
Deviation Backlog with TPE = 
CALCULATE(
  [Deviation WIP Late],
  DEVIATION_LI[EVENT_TYPE] = "TPE"
)
```

## Lab Investigation Metrics

Lab Investigations have `QUALITY_EVENT_TYPE = "Lab Investigation"`.

### Intake Metrics

**LI Intake**:
```dax
LI Intake = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] = "Lab Investigation",
  NOT ( [Timeliness (Original Due)] IN { "Cancelled", "Rejected" } )
)
```

**LI Cancelled**:
```dax
LI Cancelled = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] = "Lab Investigation",
  [Timeliness (Original Due)] = "Cancelled"
)
```

**LI Rejected**:
```dax
LI Rejected = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] = "Lab Investigation",
  [Timeliness (Original Due)] = "Rejected"
)
```

**LI Cancel or Reject**:
```dax
LI Cancel or Reject = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] = "Lab Investigation",
  [Timeliness (Original Due)] IN { "Cancelled", "Rejected" }
)
```

### Work In Progress Metrics

**LI WIP Total**:
```dax
LI WIP Total = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] = "Lab Investigation",
  ISBLANK(DEVIATION_LI[QA_CLOSED_AT]),
  NOT ( [Timeliness (Original Due)] IN { "Cancelled", "Rejected" } )
)
```

**LI WIP On-Time**:
```dax
LI WIP On-Time = 
CALCULATE(
  [LI WIP Total],
  [Timeliness (Original Due)] = "Current Ongoing On-Time"
)
```

**LI WIP Late**:
```dax
LI WIP Late = 
CALCULATE(
  [LI WIP Total],
  [Timeliness (Original Due)] = "Current Ongoing Late"
)
```

**LI WIP No Due Date**:
```dax
LI WIP No Due = 
CALCULATE(
  [LI WIP Total],
  [Timeliness (Original Due)] = "OnGoing - No Due Date"
)
```

### Closed Metrics

**LI Closed Total**:
```dax
LI Closed Total = 
CALCULATE(
  COUNTA(DEVIATION_LI[EVENT_NAME]),
  DEVIATION_LI[QUALITY_EVENT_TYPE] = "Lab Investigation",
  NOT ISBLANK(DEVIATION_LI[QA_CLOSED_AT]),
  NOT ( [Timeliness (Original Due)] IN { "Cancelled", "Rejected" } )
)
```

**LI Closed On-Time**:
```dax
LI Closed On-Time = 
CALCULATE(
  [LI Closed Total],
  [Timeliness (Original Due)] = "Closed On-Time"
)
```

**LI Closed Late**:
```dax
LI Closed Late = 
CALCULATE(
  [LI Closed Total],
  [Timeliness (Original Due)] = "Closed Late"
)
```

## Status Categories

### Timeliness Status Values

**For Closed Records:**
- `"Closed On-Time"` - Closed on or before effective due date
- `"Closed Late"` - Closed after effective due date

**For Open Records:**
- `"Current Ongoing On-Time"` - Open and not yet due
- `"Current Ongoing Late"` - Open and past due (Backlog)
- `"OnGoing - No Due Date"` - Open without a due date

**Special Statuses:**
- `"Cancelled"` - Cancelled state
- `"Rejected"` - Rejected status

### QA Closure Logic

Records are considered "Closed" when:
- `OVERALL_INVESTIGATION_END_TS` is not null, OR
- `CLOSED_TS` is not null

QA Closure Date = `COALESCE(OVERALL_INVESTIGATION_END_TS, CLOSED_TS)`

### PHENIX Override Logic

Special handling for legacy PHENIX system records:
- If `SOURCE_SYSTEM = "PHENIX"` AND `PREVIOUS_ID IS NOT NULL` → Treat as "Closed"
- If `EVENT_NAME = "NBOD23E0073"` → Treat as "Closed"
- If `SOURCE_SYSTEM IS NULL OR TRIM(SOURCE_SYSTEM) = ""` → Treat as "Closed"

## Lab Investigation Phases

Based on `SOURCE_STATUS` field:
- **Phase I** - `"In Phase I Investigation"`
- **Phase II** - `"In Phase II Investigation"`
- **Closed LI** - `"Closed"`
- **Initiated LI** - `"Initiated"`
- **In Final Approval LI** - `"In Final Approval"`

## Owning Groups

Calculated based on `DEPARTMENT`, `BUILDING`, and `OWNING_ENTITY`:

### Building Codes:
- **8NYA** - 8 New York Avenue, Framingham (Biologics - Suites 1 & 2)
- **45/51NYA** - 45/51 New York Avenue, Framingham (Thyrogen)
- **74NYA** - 74 New York Avenue, Framingham (Vaccine)
- **76NYA** - 76 New York Avenue, Framingham (Biosurgery - HA, Seprafilm)
- **11 Forbes Rd** - 11 Forbes Road, Northborough (Supply Chain, L&P)
- **MABC** - MA BioCampus (General/Support)
- **E&M** - Engineering & Maintenance
- **QC** - Quality Control
- **QA** - Quality Assurance
- **Contamination Ctrl** - Contamination Control

## Usage in AI-COMPASS

The QMS Dashboard in AI-COMPASS replicates these DAX calculations in TypeScript:

```typescript
// Calculate total deviations (excluding LI)
const totalDeviations = deviations.filter(d => 
  d.qualityEventType !== 'Lab Investigation'
).length;

// Calculate open items (WIP)
const openItems = deviations.filter(d => 
  d.status !== 'closed' && 
  !['Cancelled', 'Rejected'].includes(d.timeliness)
).length;

// Calculate on-time closure rate
const closedOnTime = deviations.filter(d =>
  d.timeliness === 'Closed On-Time'
).length;

const closedTotal = deviations.filter(d =>
  d.status === 'closed' &&
  !['Cancelled', 'Rejected'].includes(d.timeliness)
).length;

const onTimeRate = closedTotal > 0 
  ? (closedOnTime / closedTotal) * 100 
  : 0;
```

## Related Files

- **M Query**: See user-provided Power BI M query in setup documentation
- **TypeScript Implementation**: `src/services/qmsDataService.ts`
- **QMS Dashboard**: `src/pages/QMS.tsx`

## References

- [Power BI DAX Documentation](https://learn.microsoft.com/en-us/dax/)
- [Snowflake Integration](https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-connect-snowflake)
