/**
 * Enhanced SONA Agent with Intent Classification and Smart Response Generation
 * 
 * This file integrates the new intelligent services:
 * - IntentClassifier: Understands user intent beyond keyword matching
 * - AnalyticsQueryService: Processes natural language analytics questions
 * - ResponseGenerator: Context-aware, dynamic response generation
 * - TracingService: Observability and traceability for user transparency
 */

import type { Msg, UserProfile } from './types'
import type { Tool } from '../../types'
import { IntentClassifier, UserIntent } from './services/intentClassifier'
import { ResponseGenerator } from './services/responseGenerator'
import { tracingService, SpanType } from '../../services/tracing/tracingService'

export class EnhancedSONAAgent {
  private intentClassifier: IntentClassifier
  private responseGenerator: ResponseGenerator
  
  constructor(tools: Tool[]) {
    this.intentClassifier = new IntentClassifier()
    this.responseGenerator = new ResponseGenerator({
      tools,
      language: 'en'
    })
  }
  
  /**
   * Process user message with intelligent intent classification
   */
  async processMessage(
    userMessage: string,
    conversationHistory: Msg[] = [],
    userProfile?: UserProfile
  ): Promise<string> {
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
      
      // Step 2: Generate context-aware response
      const intentTypeName = UserIntent[intent.type]
      const responseSpanId = tracingService.startSpan(
        SpanType.RESPONSE_GENERATION,
        'Generate Response',
        { 
          intentType: intentTypeName,
          confidence: intent.confidence
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
      
      // End trace successfully
      tracingService.endTrace({ 
        responseLength: response.length,
        intentType: UserIntent[intent.type],
        confidence: intent.confidence
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
}

/**
 * Helper function to create an enhanced agent instance
 */
export function createEnhancedAgent(tools: Tool[]): EnhancedSONAAgent {
  return new EnhancedSONAAgent(tools)
}
