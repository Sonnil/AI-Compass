/**
 * Enhanced SONA Agent with Intent Classification and Smart Response Generation
 * 
 * This file integrates the new intelligent services:
 * - IntentClassifier: Understands user intent beyond keyword matching
 * - AnalyticsQueryService: Processes natural language analytics questions
 * - ResponseGenerator: Context-aware, dynamic response generation
 */

import type { Msg, UserProfile } from './types'
import type { Tool } from '../../types'
import { IntentClassifier, UserIntent } from './services/intentClassifier'
import { ResponseGenerator } from './services/responseGenerator'

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
    // Step 1: Classify intent
    const intent = this.intentClassifier.classify(userMessage)
    
    console.log('🧠 [EnhancedSONAAgent] Intent classified:', {
      type: UserIntent[intent.type],
      confidence: intent.confidence,
      entities: intent.entities
    })
    
    // Step 2: Generate context-aware response
    const response = this.responseGenerator.generateResponse(intent, userMessage)
    
    return response
  }
  
  /**
   * Determine if a query should use the enhanced agent
   * Use enhanced agent for:
   * - Tool recommendations
   * - Tool comparisons
   * - Analytics questions
   * - Platform help
   * - Tool details
   */
  shouldUseEnhancedAgent(userMessage: string): boolean {
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
