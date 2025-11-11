/**
 * TraceViewer Component
 * 
 * Displays real-time trace information showing what SONA is doing
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { tracingService, Trace, TraceSpan, EventType, SpanType } from '../services/tracing/tracingService'

interface TraceViewerProps {
  isOpen: boolean
  onClose: () => void
}

const SpanTypeColors: Record<SpanType, string> = {
  [SpanType.INTENT_CLASSIFICATION]: 'bg-purple-500',
  [SpanType.TOOL_SEARCH]: 'bg-blue-500',
  [SpanType.RESPONSE_GENERATION]: 'bg-green-500',
  [SpanType.ANALYTICS_QUERY]: 'bg-yellow-500',
  [SpanType.TOOL_COMPARISON]: 'bg-pink-500',
  [SpanType.KNOWLEDGE_RETRIEVAL]: 'bg-indigo-500'
}

const SpanTypeIcons: Record<SpanType, string> = {
  [SpanType.INTENT_CLASSIFICATION]: '🧠',
  [SpanType.TOOL_SEARCH]: '🔍',
  [SpanType.RESPONSE_GENERATION]: '✍️',
  [SpanType.ANALYTICS_QUERY]: '📊',
  [SpanType.TOOL_COMPARISON]: '⚖️',
  [SpanType.KNOWLEDGE_RETRIEVAL]: '📚'
}

export const TraceViewer: React.FC<TraceViewerProps> = ({ isOpen, onClose }) => {
  const [currentTrace, setCurrentTrace] = useState<Trace | null>(null)
  const [allTraces, setAllTraces] = useState<Trace[]>([])
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null)
  const [selectedSpan, setSelectedSpan] = useState<TraceSpan | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Subscribe to trace updates
      const unsubscribe = tracingService.subscribe((trace) => {
        setCurrentTrace(trace)
        // Update all traces
        setAllTraces(tracingService.getAllTraces())
        // Auto-select the current trace
        if (trace) {
          setSelectedTraceId(trace.id)
        }
      })

      // Get initial data
      const current = tracingService.getCurrentTrace()
      const all = tracingService.getAllTraces()
      
      setCurrentTrace(current)
      setAllTraces(all)
      
      // Select the most recent trace (current or last completed)
      if (current) {
        setSelectedTraceId(current.id)
      } else if (all.length > 0) {
        setSelectedTraceId(all[all.length - 1].id)
      }

      return unsubscribe
    }
  }, [isOpen])

  if (!isOpen) return null

  // Get the trace to display
  const displayTrace = selectedTraceId
    ? (currentTrace?.id === selectedTraceId ? currentTrace : allTraces.find(t => t.id === selectedTraceId))
    : currentTrace || (allTraces.length > 0 ? allTraces[allTraces.length - 1] : null)

  // Show empty state if no traces available
  if (!displayTrace) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-12 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Traces Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  Start a conversation with SONA to see trace information. Ask any question and watch the AI's thought process unfold!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg font-medium"
              >
                Got it, let's chat!
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const time = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    const ms = date.getMilliseconds().toString().padStart(3, '0')
    return `${time}.${ms}`
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">🔍 SONA Trace Viewer</h2>
                <p className="text-purple-100 text-sm">
                  Real-time observability: {displayTrace.userQuery}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Trace Stats */}
            <div className="flex gap-4 mt-4 text-sm">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="opacity-80">Spans:</span>{' '}
                <span className="font-semibold">{displayTrace.spans.length}</span>
              </div>
              {displayTrace.duration && (
                <div className="bg-white/20 rounded-lg px-3 py-1">
                  <span className="opacity-80">Duration:</span>{' '}
                  <span className="font-semibold">{formatDuration(displayTrace.duration)}</span>
                </div>
              )}
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="opacity-80">Status:</span>{' '}
                <span className="font-semibold">
                  {displayTrace.endTime ? '✓ Complete' : '⏳ Running'}
                </span>
              </div>
              {allTraces.length > 0 && (
                <div className="bg-white/20 rounded-lg px-3 py-1">
                  <span className="opacity-80">History:</span>{' '}
                  <span className="font-semibold">{allTraces.length} trace{allTraces.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex h-[calc(85vh-180px)]">
            {/* Span Timeline */}
            <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Operation Timeline</h3>
              
              <div className="space-y-3">
                {displayTrace.spans.map((span, index) => {
                  const isSelected = selectedSpan?.id === span.id
                  const statusColor = 
                    span.status === 'running' ? 'border-blue-500' :
                    span.status === 'success' ? 'border-green-500' :
                    'border-red-500'

                  return (
                    <motion.div
                      key={span.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        border-l-4 ${statusColor} bg-gray-50 dark:bg-gray-800 
                        rounded-lg p-4 cursor-pointer transition-all
                        ${isSelected ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'}
                      `}
                      onClick={() => setSelectedSpan(span)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{SpanTypeIcons[span.type]}</span>
                            <span className="font-semibold dark:text-white">{span.name}</span>
                            {span.status === 'running' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Running
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTime(span.startTime)}
                            {span.duration && ` · ${formatDuration(span.duration)}`}
                          </div>
                          
                          <div className="mt-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              {span.events.length} event{span.events.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Span Details */}
            <div className="w-1/2 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">
              {selectedSpan ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">
                    {SpanTypeIcons[selectedSpan.type]} {selectedSpan.name}
                  </h3>

                  {/* Metadata */}
                  {Object.keys(selectedSpan.metadata).length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Metadata
                      </h4>
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 space-y-1">
                        {Object.entries(selectedSpan.metadata).map(([key, value]) => (
                          <div key={key} className="flex gap-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">{key}:</span>
                            <span className="font-mono text-gray-900 dark:text-white break-all">
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Events ({selectedSpan.events.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedSpan.events.map((event, index) => {
                        const eventColor =
                          event.type === EventType.START ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          event.type === EventType.COMPLETE ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          event.type === EventType.ERROR ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          event.type === EventType.PROGRESS ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-gray-900 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${eventColor}`}>
                                {event.type}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(event.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white mt-2">
                              {event.message}
                            </p>
                            {event.data && (
                              <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                {JSON.stringify(event.data, null, 2)}
                              </pre>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Select a span to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  if (displayTrace) {
                    const json = tracingService.exportTrace(displayTrace.id)
                    const blob = new Blob([json], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `sona-trace-${displayTrace.id}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                📥 Export Trace
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
