/**
 * ThinkingProcess Component
 * 
 * Shows what SONA is thinking/doing in real-time during query processing
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { tracingService, Trace, SpanType } from '../services/tracing/tracingService'
import { Brain, Search, Edit3, BarChart3, Scale, BookOpen } from 'lucide-react'

interface ThinkingProcessProps {
  isVisible: boolean
}

const SpanTypeIcons = {
  [SpanType.INTENT_CLASSIFICATION]: Brain,
  [SpanType.TOOL_SEARCH]: Search,
  [SpanType.RESPONSE_GENERATION]: Edit3,
  [SpanType.ANALYTICS_QUERY]: BarChart3,
  [SpanType.TOOL_COMPARISON]: Scale,
  [SpanType.KNOWLEDGE_RETRIEVAL]: BookOpen
}

const SpanTypeColors = {
  [SpanType.INTENT_CLASSIFICATION]: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20',
  [SpanType.TOOL_SEARCH]: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
  [SpanType.RESPONSE_GENERATION]: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
  [SpanType.ANALYTICS_QUERY]: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20',
  [SpanType.TOOL_COMPARISON]: 'text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-900/20',
  [SpanType.KNOWLEDGE_RETRIEVAL]: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20'
}

export const ThinkingProcess: React.FC<ThinkingProcessProps> = ({ isVisible }) => {
  const [currentTrace, setCurrentTrace] = useState<Trace | null>(null)
  const [expandedSpans, setExpandedSpans] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Subscribe to trace updates
    const unsubscribe = tracingService.subscribe((trace) => {
      setCurrentTrace(trace)
    })

    // Get initial trace
    setCurrentTrace(tracingService.getCurrentTrace())

    return unsubscribe
  }, [])

  const toggleSpan = (spanId: string) => {
    const newExpanded = new Set(expandedSpans)
    if (newExpanded.has(spanId)) {
      newExpanded.delete(spanId)
    } else {
      newExpanded.add(spanId)
    }
    setExpandedSpans(newExpanded)
  }

  if (!isVisible || !currentTrace) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-blue-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            🧠 SONA is thinking...
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {currentTrace.spans.filter(s => s.status === 'success').length} / {currentTrace.spans.length} steps complete
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {currentTrace.spans.map((span, index) => {
            const Icon = SpanTypeIcons[span.type]
            const isExpanded = expandedSpans.has(span.id)
            const latestEvent = span.events[span.events.length - 1]

            return (
              <motion.div
                key={span.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleSpan(span.id)}
                  className="w-full p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${SpanTypeColors[span.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {span.name}
                      </span>
                      {span.status === 'running' && (
                        <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                          <span className="animate-pulse">●</span> Running
                        </span>
                      )}
                      {span.status === 'success' && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          ✓ Complete
                        </span>
                      )}
                      {span.duration && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({span.duration}ms)
                        </span>
                      )}
                    </div>
                    
                    {latestEvent && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {latestEvent.message}
                      </p>
                    )}
                  </div>

                  <svg
                    className={`flex-shrink-0 w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 space-y-2">
                        {span.events.map((event, eventIndex) => (
                          <motion.div
                            key={eventIndex}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: eventIndex * 0.05 }}
                            className="flex items-start gap-2"
                          >
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                              {new Date(event.timestamp).toLocaleTimeString('en-US', {
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </span>
                            <p className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                              {event.message}
                            </p>
                          </motion.div>
                        ))}

                        {Object.keys(span.metadata).length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                              Metadata:
                            </p>
                            <div className="space-y-1">
                              {Object.entries(span.metadata).map(([key, value]) => (
                                <div key={key} className="flex gap-2 text-xs">
                                  <span className="text-gray-500 dark:text-gray-400">{key}:</span>
                                  <span className="text-gray-700 dark:text-gray-300 font-mono">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {currentTrace.endTime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400"
        >
          <span>✓ Processing complete</span>
          <span>Total time: {currentTrace.duration}ms</span>
        </motion.div>
      )}
    </motion.div>
  )
}
