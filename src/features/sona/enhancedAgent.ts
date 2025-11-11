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
    const startTime = Date.now()
    
    // Start trace
    const traceId = tracingService.startTrace(userMessage, {
      conversationLength: conversationHistory.length,
      userProfile: userProfile?.name || 'anonymous'
    })
    
    try {
      // Step 1: Classify intent
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
      
      const intent = this.intentClassifier.classify(userMessage)
      
      tracingService.addSpanEvent(
        intentSpanId,
        'info' as any,
        `Intent detected: ${UserIntent[intent.type]}`,
        { 
          confidence: intent.confidence,
          entities: intent.entities
        }
      )
      
      console.log('🧠 [EnhancedSONAAgent] Intent classified:', {
        type: UserIntent[intent.type],
        confidence: intent.confidence,
        entities: intent.entities
      })
      
      tracingService.endSpan(intentSpanId, 'success')
      
      // Step 2: Apply reasoning for complex queries
      let reasoningChain
      const shouldUseReasoning = [
        UserIntent.TOOL_RECOMMENDATION,
        UserIntent.TOOL_COMPARISON,
        UserIntent.TOOL_DETAILS
      ].includes(intent.type)
      
      if (shouldUseReasoning) {
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
      }
      
      // Step 3: Generate context-aware response
      const intentTypeName = UserIntent[intent.type]
      const responseSpanId = tracingService.startSpan(
        SpanType.RESPONSE_GENERATION,
        'Generate Response',
        { 
          intentType: intentTypeName,
          confidence: intent.confidence,
          useReasoning: shouldUseReasoning
        }
      )
      
      tracingService.addSpanEvent(
        responseSpanId,
        'progress' as any,
        'Generating contextual response based on intent...'
      )
      
      const response = this.responseGenerator.generateResponse(intent, userMessage)
      
      tracingService.addSpanEvent(
        responseSpanId,
        'info' as any,
        `Generated response (${response.length} characters)`
      )
      
      tracingService.endSpan(responseSpanId, 'success')
      
      // Step 4: Record interaction for learning
      const timeToResponse = Date.now() - startTime
      const toolsRecommended = this.extractToolNames(response)
      
      learningService.recordInteraction({
        userId: userProfile?.name || 'anonymous',
        sessionId: this.sessionId,
        timestamp: Date.now(),
        query: userMessage,
        intent: UserIntent[intent.type],
        confidence: intent.confidence,
        responseProvided: response,
        toolsRecommended,
        timeToResponse,
        conversationContext: {
          previousQueries: conversationHistory.map(msg => msg.content).slice(-5),
          topicsDiscussed: this.extractTopics(conversationHistory)
        }
      })
      
      // End trace successfully
      tracingService.endTrace({ 
        responseLength: response.length,
        intentType: UserIntent[intent.type],
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
