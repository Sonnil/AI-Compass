# SONA Observability & Traceability

## Overview

AI-COMPASS now includes comprehensive observability and traceability features that allow users to see exactly what SONA (the AI agent) is doing when processing their queries. This transparency builds trust and helps users understand how AI decisions are made.

## Features

### 1. Real-Time Thinking Process Display

When SONA processes a user query, a visual "Thinking Process" component displays in the chat widget showing:
- **Intent Classification**: Understanding what the user wants
- **Tool Search**: Finding relevant tools in the catalog
- **Response Generation**: Creating a contextual response
- **Analytics Query**: Processing analytics questions
- **Tool Comparison**: Comparing multiple tools
- **Knowledge Retrieval**: Accessing knowledge base

Each operation shows:
- Operation name and icon
- Current status (Running, Complete)
- Duration (in milliseconds)
- Progress events with timestamps
- Detailed metadata

### 2. Comprehensive Trace Viewer

Click the Activity (📊) icon in the chat header to open the full Trace Viewer, which provides:

**Timeline View:**
- Sequential list of all operations
- Visual status indicators (running, success, error)
- Duration for each operation
- Event counts

**Span Details:**
- Complete event log for each operation
- Event types: START, PROGRESS, COMPLETE, ERROR, INFO
- Timestamps for every event
- Metadata including:
  - Confidence scores
  - Detected entities
  - Intent types
  - Tool matches

**Export Functionality:**
- Download complete trace as JSON
- Share traces for debugging
- Analyze patterns offline

### 3. Developer-Friendly Tracing API

The tracing service provides a clean API for adding observability to any agent operation:

```typescript
import { tracingService, SpanType } from './services/tracing/tracingService'

// Start a trace
const traceId = tracingService.startTrace(userQuery, { userId: '123' })

// Start a span
const spanId = tracingService.startSpan(
  SpanType.INTENT_CLASSIFICATION,
  'Classify User Intent',
  { query: userQuery }
)

// Add events
tracingService.addSpanEvent(
  spanId,
  'progress',
  'Analyzing query patterns...'
)

tracingService.addSpanEvent(
  spanId,
  'info',
  'Intent detected: TOOL_RECOMMENDATION',
  { confidence: 0.95 }
)

// End span
tracingService.endSpan(spanId, 'success')

// End trace
tracingService.endTrace({ totalOperations: 3 })
```

## Architecture

### Components

1. **TracingService** (`src/services/tracing/tracingService.ts`)
   - Core tracing engine
   - Manages traces and spans
   - Publishes updates to subscribers
   - Stores last 50 traces in memory

2. **ThinkingProcess** (`src/components/ThinkingProcess.tsx`)
   - Real-time display in chat widget
   - Shows current operation progress
   - Expandable details for each operation
   - Auto-updates via subscription

3. **TraceViewer** (`src/components/TraceViewer.tsx`)
   - Full-screen trace analysis
   - Timeline and detail views
   - Export functionality
   - Dark mode support

4. **EnhancedAgent** (Updated)
   - Integrated tracing calls
   - Automatic span creation
   - Event logging at key points
   - Error tracking

### Data Flow

```
User Query
    ↓
EnhancedAgent.processMessage()
    ↓
tracingService.startTrace()
    ↓
Intent Classification
    ├── startSpan(INTENT_CLASSIFICATION)
    ├── addSpanEvent('progress', ...)
    ├── addSpanEvent('info', intent detected)
    └── endSpan('success')
    ↓
Response Generation
    ├── startSpan(RESPONSE_GENERATION)
    ├── addSpanEvent('progress', ...)
    └── endSpan('success')
    ↓
tracingService.endTrace()
    ↓
UI Updates (via subscription)
```

## Usage

### For Users

1. **See What SONA is Thinking**
   - Open the SONA chat widget
   - Ask any question
   - Watch the "🧠 SONA is thinking..." panel appear
   - See real-time progress of each operation
   - Operations complete with checkmarks ✓

2. **View Detailed Traces**
   - Click the Activity icon (📊) in chat header
   - Browse the operation timeline
   - Click any operation to see detailed events
   - View metadata like confidence scores
   - Export trace for sharing or analysis

3. **Understand AI Decisions**
   - See how SONA interpreted your question
   - View which tools were considered
   - Understand the confidence levels
   - Learn from the thinking process

### For Developers

1. **Add Tracing to New Operations**

```typescript
import { tracingService, SpanType } from './services/tracing/tracingService'

export class MyNewService {
  async processQuery(query: string) {
    const spanId = tracingService.startSpan(
      SpanType.KNOWLEDGE_RETRIEVAL,
      'Search Knowledge Base',
      { query }
    )
    
    try {
      tracingService.addSpanEvent(spanId, 'progress', 'Searching...')
      
      const results = await this.search(query)
      
      tracingService.addSpanEvent(
        spanId,
        'info',
        `Found ${results.length} results`,
        { count: results.length }
      )
      
      tracingService.endSpan(spanId, 'success')
      return results
    } catch (error) {
      tracingService.addSpanEvent(
        spanId,
        'error',
        error.message
      )
      tracingService.endSpan(spanId, 'error')
      throw error
    }
  }
}
```

2. **Subscribe to Trace Updates**

```typescript
import { tracingService } from './services/tracing/tracingService'

const unsubscribe = tracingService.subscribe((trace) => {
  console.log('Trace updated:', trace)
  // Update your UI or analytics
})

// Clean up when done
unsubscribe()
```

3. **Analyze Traces**

```typescript
// Get all traces
const traces = tracingService.getAllTraces()

// Find slow operations
const slowSpans = traces
  .flatMap(t => t.spans)
  .filter(s => s.duration && s.duration > 1000)

// Calculate average response time
const avgDuration = traces
  .filter(t => t.duration)
  .reduce((sum, t) => sum + t.duration!, 0) / traces.length
```

## Span Types

| Type | Icon | Description | Use Case |
|------|------|-------------|----------|
| `INTENT_CLASSIFICATION` | 🧠 | Understanding user intent | What does the user want? |
| `TOOL_SEARCH` | 🔍 | Finding relevant tools | Which tools match the query? |
| `RESPONSE_GENERATION` | ✍️ | Creating responses | Generating natural language |
| `ANALYTICS_QUERY` | 📊 | Processing analytics | Computing statistics |
| `TOOL_COMPARISON` | ⚖️ | Comparing tools | Side-by-side analysis |
| `KNOWLEDGE_RETRIEVAL` | 📚 | Accessing knowledge | Retrieving facts/docs |

## Event Types

- **START**: Operation begins
- **PROGRESS**: Intermediate updates
- **INFO**: Informational events (intent detected, results found)
- **COMPLETE**: Operation succeeds
- **ERROR**: Operation fails

## Benefits

### For Users
- **Transparency**: See exactly what AI is doing
- **Trust**: Understand how decisions are made
- **Learning**: Learn about AI processes
- **Debugging**: Identify issues in responses

### For Developers
- **Debugging**: Trace execution flow
- **Performance**: Identify bottlenecks
- **Monitoring**: Track operation success rates
- **Analytics**: Understand usage patterns

### For Stakeholders
- **Explainability**: AI decisions are transparent
- **Compliance**: Audit trail of AI operations
- **Quality**: Monitor AI performance
- **Insights**: Data-driven improvements

## Performance Considerations

- Traces stored in memory (last 50)
- Minimal overhead (~1-2ms per operation)
- Async event processing
- Efficient React subscriptions
- No external dependencies

## Privacy & Security

- No sensitive data in traces
- Local storage only (no external APIs)
- User can clear traces anytime
- Export requires explicit user action

## Future Enhancements

- [ ] OpenTelemetry integration
- [ ] Remote trace storage
- [ ] Advanced analytics dashboard
- [ ] Trace search and filtering
- [ ] Performance metrics visualization
- [ ] Comparison between traces
- [ ] AI performance benchmarking

## Related Documentation

- [SONA Agent Architecture](./SONA_ARCHITECTURE.md)
- [Intent Classification](./INTENT_CLASSIFICATION.md)
- [Response Generation](./RESPONSE_GENERATION.md)
