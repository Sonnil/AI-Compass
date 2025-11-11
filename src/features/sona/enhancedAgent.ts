/**
 * Enhanced SONA Agent with Intent Classification and Smart Response Generation
 * 
 * This file integrates the new intelligent services:
 * - IntentClassifier: Understands user intent beyond keyword matching
 * - AnalyticsQueryService: Processes natural language analytics questions
 * - ResponseGenerator: Context-aware, dynamic response generation
 * - TracingService: Observability and traceability for user transparency
 * - LearningService: Tracks interactions and learns from user feedback
 * - ReasoningService: Multi-step reasoning for complex queries
 */

import type { Msg, UserProfile } from './types'
import type { Tool } from '../../types'
import { IntentClassifier, UserIntent } from './services/intentClassifier'
import { ResponseGenerator } from './services/responseGenerator'
import { tracingService, SpanType } from '../../services/tracing/tracingService'
import { learningService } from '../../services/learning/learningService'
import { reasoningService } from '../../services/reasoning/reasoningService'

export class EnhancedSONAAgent {
  private intentClassifier: IntentClassifier
  private responseGenerator: ResponseGenerator
  private tools: Tool[]
  private sessionId: string
  
  constructor(tools: Tool[]) {
    this.tools = tools
    this.intentClassifier = new IntentClassifier()
    this.responseGenerator = new ResponseGenerator({
      tools,
      language: 'en'
    })
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Process user message with intelligent intent classification
   */
  async processMessage(
    userMessage: string,
    conversationHistory: Msg[] = [],
    userProfile?: UserProfile
  ): Promise<string> {
    console.log('🚀 [EnhancedAgent] processMessage called with:', userMessage)
    const startTime = Date.now()
    
    // Initialize intent with default value
    let intent
    let intentTypeName = 'UNKNOWN'
    
    try {
      // Start trace
      const traceId = tracingService.startTrace(userMessage, {
        conversationLength: conversationHistory.length,
        userProfile: userProfile?.name || 'anonymous'
      })
      console.log('✅ [EnhancedAgent] Trace started:', traceId)
      
      // Step 1: Classify intent (CRITICAL - must succeed)
      try {
        const intentSpanId = tracingService.startSpan(
          SpanType.INTENT_CLASSIFICATION,
          'Classify User Intent',
          { query: userMessage }
        )
        
        tracingService.addSpanEvent(
          intentSpanId,
          'progress' as any,
          'Analyzing user query to determine intent...'
        )
        
        intent = this.intentClassifier.classify(userMessage)
        intentTypeName = UserIntent[intent.type] || 'UNKNOWN'
        
        console.log('🧠 [EnhancedAgent] Intent classified:', {
          type: intentTypeName,
          confidence: intent.confidence,
          entities: intent.entities
        })
        
        tracingService.addSpanEvent(
          intentSpanId,
          'info' as any,
          `Intent detected: ${intentTypeName}`,
          { 
            confidence: intent.confidence,
            entities: intent.entities,
            intentType: intentTypeName
          }
        )
        
        tracingService.endSpan(intentSpanId, 'success')
      } catch (intentError) {
        console.error('❌ [EnhancedAgent] Intent classification failed:', intentError)
        // Create default intent to continue
        intent = {
          type: 'GENERAL_QUESTION' as any,
          confidence: 0.5,
          entities: {}
        }
        intentTypeName = 'GENERAL_QUESTION'
      }
      
      // Step 2: Apply reasoning for complex queries (OPTIONAL - won't break on error)
      let reasoningChain
      const shouldUseReasoning = [
        UserIntent.TOOL_RECOMMENDATION,
        UserIntent.TOOL_COMPARISON,
        UserIntent.TOOL_DETAILS
      ].includes(intent.type)
      
      if (shouldUseReasoning) {
        try {
          const reasoningSpanId = tracingService.startSpan(
            SpanType.RESPONSE_GENERATION,
            'Multi-Step Reasoning',
            { intentType: UserIntent[intent.type] }
          )
          
          tracingService.addSpanEvent(
            reasoningSpanId,
            'progress' as any,
            'Applying multi-step reasoning to understand requirements...'
          )
          
          // Get user expertise from learning service
          const userPrefs = learningService.getUserPreferences(userProfile?.name || 'anonymous')
          const previousQueries = conversationHistory.map(msg => msg.content).slice(-5)
          
          reasoningChain = reasoningService.reason(
            userMessage,
            intent,
            this.tools,
            {
              previousQueries,
              userExpertise: userPrefs?.expertiseLevel || 'intermediate'
            }
          )
          
          tracingService.addSpanEvent(
            reasoningSpanId,
            'info' as any,
            `Reasoning completed with ${reasoningChain.steps.length} steps`,
            {
              overallConfidence: reasoningChain.overallConfidence,
              stepsCompleted: reasoningChain.steps.length
            }
          )
          
          // Add reasoning steps to trace
          reasoningChain.steps.forEach((step, idx) => {
            tracingService.addSpanEvent(
              reasoningSpanId,
              'info' as any,
              `Step ${idx + 1}: ${step.description} (${(step.confidence * 100).toFixed(0)}% confidence)`
            )
          })
          
          tracingService.endSpan(reasoningSpanId, 'success')
          console.log('✅ [EnhancedAgent] Reasoning completed successfully')
        } catch (reasoningError) {
          console.warn('⚠️ [EnhancedAgent] Reasoning failed, continuing without it:', reasoningError)
          // Don't let reasoning errors break the whole flow - just skip reasoning
        }
      }
      
      // Step 3: Generate context-aware response
      // intentTypeName already declared at top of function
      const responseSpanId = tracingService.startSpan(
        SpanType.RESPONSE_GENERATION,
        'Generate Response',
        { 
          intentType: intentTypeName,
          confidence: intent.confidence,
          useReasoning: shouldUseReasoning && !!reasoningChain
        }
      )
      
      tracingService.addSpanEvent(
        responseSpanId,
        'progress' as any,
        'Generating contextual response based on intent...'
      )
      
      console.log('📝 [EnhancedAgent] Generating response for intent:', intentTypeName)
      const response = this.responseGenerator.generateResponse(intent, userMessage)
      console.log('✅ [EnhancedAgent] Response generated:', {
        length: response.length,
        preview: response.substring(0, 100) + '...'
      })
      
      tracingService.addSpanEvent(
        responseSpanId,
        'info' as any,
        `Generated response (${response.length} characters)`
      )
      
      tracingService.endSpan(responseSpanId, 'success')
      
      // Step 4: Record interaction for learning
      const timeToResponse = Date.now() - startTime
      const toolsRecommended = this.extractToolNames(response)
      
      console.log('📊 [EnhancedAgent] Recording interaction:', {
        sessionId: this.sessionId,
        intent: intentTypeName,
        confidence: intent.confidence,
        toolsRecommended: toolsRecommended.length
      })
      
      learningService.recordInteraction({
        userId: userProfile?.name || 'anonymous',
        sessionId: this.sessionId,
        timestamp: Date.now(),
        query: userMessage,
        intent: intentTypeName,
        confidence: intent.confidence,
        responseProvided: response,
        toolsRecommended,
        timeToResponse,
        conversationContext: {
          previousQueries: conversationHistory.map(msg => msg.content).slice(-5),
          topicsDiscussed: this.extractTopics(conversationHistory)
        }
      })
      
      console.log('✅ [EnhancedAgent] Interaction recorded successfully')
      
      // End trace successfully
      tracingService.endTrace({ 
        responseLength: response.length,
        intentType: intentTypeName,
        confidence: intent.confidence,
        timeToResponse,
        toolsRecommended: toolsRecommended.length
      })
      
      return response
    } catch (error) {
      // End trace with error
      tracingService.endTrace({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }
  
  /**
   * Determine if a query should use the enhanced agent
   * Use enhanced agent for:
   * - Tool recommendations
   * - Tool comparisons
   * - Analytics questions
   * - Platform help
   * - Tool details
   * 
   * NOTE: Now returns true for ALL queries to enable tracing for everything
   */
  shouldUseEnhancedAgent(userMessage: string): boolean {
    // Always use enhanced agent to enable tracing for all queries
    return true
    
    /* Original logic - kept for reference
    const intent = this.intentClassifier.classify(userMessage)
    
    // Use enhanced agent for high-confidence, specific intents
    const enhancedIntents = [
      UserIntent.TOOL_RECOMMENDATION,
      UserIntent.TOOL_COMPARISON,
      UserIntent.ANALYTICS_QUERY,
      UserIntent.PLATFORM_HELP,
      UserIntent.TOOL_DETAILS
    ]
    
    return enhancedIntents.includes(intent.type) && intent.confidence >= 0.6
    */
  }
  
  /**
   * Get intent classification for a message (useful for debugging/analytics)
   */
  getIntent(userMessage: string) {
    return this.intentClassifier.classify(userMessage)
  }
  
  /**
   * Record user feedback on a response
   */
  recordFeedback(
    helpful: boolean,
    satisfaction?: number,
    comment?: string
  ) {
    const feedback: 'positive' | 'negative' | 'neutral' = 
      helpful ? 'positive' : satisfaction !== undefined && satisfaction < 3 ? 'negative' : 'neutral'
    
    learningService.recordFeedback(
      this.sessionId,
      feedback,
      satisfaction
    )
  }
  
  /**
   * Get learning analytics
   */
  getLearningAnalytics() {
    return learningService.analyzeLearningPatterns()
  }
  
  /**
   * Export learning data
   */
  exportLearningData() {
    return learningService.exportLearningData()
  }
  
  /**
   * Get reasoning history
   */
  getReasoningHistory() {
    return reasoningService.getReasoningHistory()
  }
  
  /**
   * Extract tool names from response text
   */
  private extractToolNames(response: string): string[] {
    const toolNames: string[] = []
    this.tools.forEach(tool => {
      if (response.includes(tool.name)) {
        toolNames.push(tool.name)
      }
    })
    return toolNames
  }
  
  /**
   * Extract topics from conversation history
   */
  private extractTopics(history: Msg[]): string[] {
    const topics = new Set<string>()
    const topicKeywords = [
      'tool', 'ai', 'analytics', 'data', 'code', 'image', 'search',
      'research', 'medical', 'productivity', 'development', 'platform'
    ]
    
    history.forEach(msg => {
      const words = msg.content.toLowerCase().split(/\s+/)
      words.forEach(word => {
        if (topicKeywords.some(keyword => word.includes(keyword))) {
          topics.add(word)
        }
      })
    })
    
    return Array.from(topics).slice(0, 10)
  }
}

/**
 * Helper function to create an enhanced agent instance
 */
export function createEnhancedAgent(tools: Tool[]): EnhancedSONAAgent {
  return new EnhancedSONAAgent(tools)
}
