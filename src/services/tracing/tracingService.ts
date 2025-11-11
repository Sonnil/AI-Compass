/**
 * Tracing Service for SONA Agent Observability
 * 
 * Provides comprehensive tracing and observability for SONA operations,
 * allowing users to see what the AI agent is doing in real-time.
 */

export enum SpanType {
  INTENT_CLASSIFICATION = 'intent_classification',
  TOOL_SEARCH = 'tool_search',
  RESPONSE_GENERATION = 'response_generation',
  ANALYTICS_QUERY = 'analytics_query',
  TOOL_COMPARISON = 'tool_comparison',
  KNOWLEDGE_RETRIEVAL = 'knowledge_retrieval'
}

export enum EventType {
  START = 'start',
  PROGRESS = 'progress',
  COMPLETE = 'complete',
  ERROR = 'error',
  INFO = 'info'
}

export interface TraceSpan {
  id: string
  type: SpanType
  name: string
  startTime: number
  endTime?: number
  duration?: number
  status: 'running' | 'success' | 'error'
  events: TraceEvent[]
  metadata: Record<string, any>
  parentSpanId?: string
}

export interface TraceEvent {
  timestamp: number
  type: EventType
  message: string
  data?: Record<string, any>
}

export interface Trace {
  id: string
  startTime: number
  endTime?: number
  duration?: number
  userQuery: string
  spans: TraceSpan[]
  metadata: Record<string, any>
}

type TraceSubscriber = (trace: Trace) => void

class TracingService {
  private currentTrace: Trace | null = null
  private traces: Trace[] = []
  private subscribers: TraceSubscriber[] = []
  private maxTraces = 50 // Keep last 50 traces

  /**
   * Start a new trace for a user query
   */
  startTrace(userQuery: string, metadata: Record<string, any> = {}): string {
    const traceId = this.generateId()
    
    this.currentTrace = {
      id: traceId,
      startTime: Date.now(),
      userQuery,
      spans: [],
      metadata
    }

    this.notifySubscribers()
    return traceId
  }

  /**
   * Start a new span within the current trace
   */
  startSpan(
    type: SpanType,
    name: string,
    metadata: Record<string, any> = {},
    parentSpanId?: string
  ): string {
    if (!this.currentTrace) {
      console.warn('No active trace. Call startTrace() first.')
      return ''
    }

    const spanId = this.generateId()
    
    const span: TraceSpan = {
      id: spanId,
      type,
      name,
      startTime: Date.now(),
      status: 'running',
      events: [],
      metadata,
      parentSpanId
    }

    this.currentTrace.spans.push(span)
    this.addSpanEvent(spanId, EventType.START, `Starting ${name}`)
    this.notifySubscribers()

    return spanId
  }

  /**
   * Add an event to a span
   */
  addSpanEvent(
    spanId: string,
    type: EventType,
    message: string,
    data?: Record<string, any>
  ): void {
    if (!this.currentTrace) return

    const span = this.currentTrace.spans.find(s => s.id === spanId)
    if (!span) {
      console.warn(`Span ${spanId} not found`)
      return
    }

    span.events.push({
      timestamp: Date.now(),
      type,
      message,
      data
    })

    this.notifySubscribers()
  }

  /**
   * End a span
   */
  endSpan(spanId: string, status: 'success' | 'error' = 'success'): void {
    if (!this.currentTrace) return

    const span = this.currentTrace.spans.find(s => s.id === spanId)
    if (!span) {
      console.warn(`Span ${spanId} not found`)
      return
    }

    span.endTime = Date.now()
    span.duration = span.endTime - span.startTime
    span.status = status

    this.addSpanEvent(
      spanId,
      status === 'success' ? EventType.COMPLETE : EventType.ERROR,
      status === 'success' ? `Completed ${span.name}` : `Error in ${span.name}`
    )

    this.notifySubscribers()
  }

  /**
   * End the current trace
   */
  endTrace(metadata: Record<string, any> = {}): void {
    if (!this.currentTrace) return

    this.currentTrace.endTime = Date.now()
    this.currentTrace.duration = this.currentTrace.endTime - this.currentTrace.startTime
    this.currentTrace.metadata = {
      ...this.currentTrace.metadata,
      ...metadata
    }

    // Store trace
    this.traces.push(this.currentTrace)
    
    // Keep only last N traces
    if (this.traces.length > this.maxTraces) {
      this.traces.shift()
    }

    this.notifySubscribers()
    this.currentTrace = null
  }

  /**
   * Get the current trace
   */
  getCurrentTrace(): Trace | null {
    return this.currentTrace
  }

  /**
   * Get all traces
   */
  getAllTraces(): Trace[] {
    return [...this.traces]
  }

  /**
   * Get a specific trace by ID
   */
  getTrace(traceId: string): Trace | undefined {
    if (this.currentTrace?.id === traceId) {
      return this.currentTrace
    }
    return this.traces.find(t => t.id === traceId)
  }

  /**
   * Clear all traces
   */
  clearTraces(): void {
    this.traces = []
    this.currentTrace = null
    this.notifySubscribers()
  }

  /**
   * Subscribe to trace updates
   */
  subscribe(callback: TraceSubscriber): () => void {
    this.subscribers.push(callback)
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(): void {
    if (this.currentTrace) {
      this.subscribers.forEach(callback => {
        try {
          callback(this.currentTrace!)
        } catch (error) {
          console.error('Error in trace subscriber:', error)
        }
      })
    }
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Export trace as JSON
   */
  exportTrace(traceId: string): string {
    const trace = this.getTrace(traceId)
    if (!trace) {
      throw new Error(`Trace ${traceId} not found`)
    }
    return JSON.stringify(trace, null, 2)
  }
}

// Singleton instance
export const tracingService = new TracingService()
