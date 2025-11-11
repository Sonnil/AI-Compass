/**
 * Learning Service for SONA Agent
 * 
 * Tracks user interactions, preferences, and feedback to improve responses over time.
 * Implements continuous learning from user behavior and feedback.
 */

export interface UserInteraction {
  userId: string
  sessionId: string
  timestamp: number
  query: string
  intent: string
  confidence: number
  responseProvided: string
  feedback?: 'positive' | 'negative' | 'neutral'
  toolsRecommended?: string[]
  toolsSelected?: string[]
  timeToResponse: number
  userSatisfaction?: number // 1-5 rating
  conversationContext?: {
    previousQueries: string[]
    topicsDiscussed: string[]
  }
}

export interface UserPreference {
  userId: string
  preferredToolTypes: string[]
  preferredFeatures: string[]
  frequentQueries: string[]
  learningStyle: 'detailed' | 'concise' | 'balanced'
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced'
  interactionPatterns: {
    avgQueryLength: number
    avgResponseTime: number
    preferredTimeOfDay?: string
  }
  lastUpdated: number
}

export interface LearningModel {
  intentAccuracy: Map<string, number>
  responseEffectiveness: Map<string, number>
  toolRecommendationSuccess: Map<string, number>
  commonMisclassifications: Array<{
    query: string
    expectedIntent: string
    actualIntent: string
    count: number
  }>
  improvementMetrics: {
    totalFeedback: number
    positiveFeedback: number
    negativeFeedback: number
    averageSatisfaction: number
  }
}

class LearningService {
  private interactions: UserInteraction[] = []
  private userPreferences: Map<string, UserPreference> = new Map()
  private learningModel: LearningModel
  private readonly INTERACTION_STORAGE_KEY = 'sona_interactions'
  private readonly PREFERENCES_STORAGE_KEY = 'sona_preferences'
  private readonly MAX_INTERACTIONS = 1000

  constructor() {
    this.learningModel = {
      intentAccuracy: new Map(),
      responseEffectiveness: new Map(),
      toolRecommendationSuccess: new Map(),
      commonMisclassifications: [],
      improvementMetrics: {
        totalFeedback: 0,
        positiveFeedback: 0,
        negativeFeedback: 0,
        averageSatisfaction: 0
      }
    }
    
    this.loadFromStorage()
  }

  /**
   * Record a user interaction for learning
   */
  recordInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction)
    
    if (this.interactions.length > this.MAX_INTERACTIONS) {
      this.interactions = this.interactions.slice(-this.MAX_INTERACTIONS)
    }
    
    this.updateUserPreferences(interaction)
    this.updateLearningModel(interaction)
    this.saveToStorage()
  }

  /**
   * Record user feedback on a response
   */
  recordFeedback(
    sessionId: string,
    feedback: 'positive' | 'negative' | 'neutral',
    satisfaction?: number
  ): void {
    const interaction = this.interactions.find(i => i.sessionId === sessionId)
    if (interaction) {
      interaction.feedback = feedback
      interaction.userSatisfaction = satisfaction
      
      // Update improvement metrics
      this.learningModel.improvementMetrics.totalFeedback++
      if (feedback === 'positive') {
        this.learningModel.improvementMetrics.positiveFeedback++
      } else if (feedback === 'negative') {
        this.learningModel.improvementMetrics.negativeFeedback++
      }
      
      if (satisfaction) {
        const total = this.learningModel.improvementMetrics.averageSatisfaction * 
                     (this.learningModel.improvementMetrics.totalFeedback - 1)
        this.learningModel.improvementMetrics.averageSatisfaction = 
          (total + satisfaction) / this.learningModel.improvementMetrics.totalFeedback
      }
      
      this.updateLearningModel(interaction)
      this.saveToStorage()
    }
  }

  /**
   * Get user preferences for personalization
   */
  getUserPreferences(userId: string): UserPreference | undefined {
    return this.userPreferences.get(userId)
  }

  /**
   * Get personalized tool recommendations based on learning
   */
  getPersonalizedRecommendations(
    userId: string,
    intent: string,
    tools: any[]
  ): any[] {
    const preferences = this.getUserPreferences(userId)
    if (!preferences) return tools

    const scoredTools = tools.map(tool => {
      let score = 0
      
      // Prefer tools matching user's preferred types
      if (preferences.preferredToolTypes.some(type => 
        tool.type?.toLowerCase().includes(type.toLowerCase()) ||
        tool.tags?.some((tag: string) => tag.toLowerCase().includes(type.toLowerCase()))
      )) {
        score += 3
      }
      
      // Prefer tools with features user likes
      if (tool.realTimeWebSearch && preferences.preferredFeatures.includes('realTimeWebSearch')) {
        score += 2
      }
      if (tool.codeGeneration && preferences.preferredFeatures.includes('codeGeneration')) {
        score += 2
      }
      if (tool.imageGeneration && preferences.preferredFeatures.includes('imageGeneration')) {
        score += 2
      }
      
      // Historical success rate for this tool
      const successRate = this.learningModel.toolRecommendationSuccess.get(tool.id || tool.name) || 0.5
      score += successRate * 5
      
      return { tool, score }
    })

    return scoredTools
      .sort((a, b) => b.score - a.score)
      .map(item => item.tool)
  }

  /**
   * Get response style based on user learning style
   */
  getResponseStyle(userId: string): 'detailed' | 'concise' | 'balanced' {
    const preferences = this.getUserPreferences(userId)
    return preferences?.learningStyle || 'balanced'
  }

  /**
   * Get expertise level for response adaptation
   */
  getExpertiseLevel(userId: string): 'beginner' | 'intermediate' | 'advanced' {
    const preferences = this.getUserPreferences(userId)
    return preferences?.expertiseLevel || 'intermediate'
  }

  /**
   * Get intent classification confidence adjustment based on historical accuracy
   */
  getIntentConfidenceAdjustment(intent: string): number {
    const accuracy = this.learningModel.intentAccuracy.get(intent)
    if (!accuracy) return 1.0
    
    // Boost confidence for historically accurate intents
    // Reduce for less accurate ones
    return 0.5 + (accuracy * 0.5)
  }

  /**
   * Analyze learning patterns and generate insights
   */
  analyzeLearningPatterns(): {
    totalInteractions: number
    averageSatisfaction: number
    intentAccuracyRate: number
    topTools: Array<{ tool: string; successRate: number }>
    commonQueries: Array<{ query: string; count: number }>
    needsImprovement: string[]
    userGrowth: {
      beginnersCount: number
      intermediateCount: number
      advancedCount: number
    }
  } {
    const totalInteractions = this.interactions.length
    
    // Average satisfaction
    const satisfactionScores = this.interactions
      .filter(i => i.userSatisfaction !== undefined)
      .map(i => i.userSatisfaction!)
    const averageSatisfaction = satisfactionScores.length > 0
      ? satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length
      : 0

    // Intent accuracy rate
    const feedbackInteractions = this.interactions.filter(i => i.feedback)
    const positiveRate = feedbackInteractions.length > 0
      ? feedbackInteractions.filter(i => i.feedback === 'positive').length / feedbackInteractions.length
      : 0

    // Top performing tools
    const topTools = Array.from(this.learningModel.toolRecommendationSuccess.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tool, successRate]) => ({ tool, successRate }))

    // Common queries
    const queryCount = new Map<string, number>()
    this.interactions.forEach(i => {
      const normalized = i.query.toLowerCase().trim()
      queryCount.set(normalized, (queryCount.get(normalized) || 0) + 1)
    })
    const commonQueries = Array.from(queryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }))

    // Areas needing improvement
    const needsImprovement: string[] = []
    
    this.learningModel.intentAccuracy.forEach((accuracy, intent) => {
      if (accuracy < 0.7) {
        needsImprovement.push(
          `Intent "${intent}" accuracy: ${(accuracy * 100).toFixed(1)}%`
        )
      }
    })

    if (this.learningModel.commonMisclassifications.length > 0) {
      needsImprovement.push(
        `${this.learningModel.commonMisclassifications.length} common misclassifications`
      )
    }

    // User growth tracking
    const userGrowth = {
      beginnersCount: 0,
      intermediateCount: 0,
      advancedCount: 0
    }
    
    this.userPreferences.forEach(pref => {
      if (pref.expertiseLevel === 'beginner') userGrowth.beginnersCount++
      else if (pref.expertiseLevel === 'intermediate') userGrowth.intermediateCount++
      else userGrowth.advancedCount++
    })

    return {
      totalInteractions,
      averageSatisfaction,
      intentAccuracyRate: positiveRate,
      topTools,
      commonQueries,
      needsImprovement,
      userGrowth
    }
  }

  /**
   * Update user preferences based on interactions
   */
  private updateUserPreferences(interaction: UserInteraction): void {
    let preferences = this.userPreferences.get(interaction.userId)
    
    if (!preferences) {
      preferences = {
        userId: interaction.userId,
        preferredToolTypes: [],
        preferredFeatures: [],
        frequentQueries: [],
        learningStyle: 'balanced',
        expertiseLevel: 'intermediate',
        interactionPatterns: {
          avgQueryLength: 0,
          avgResponseTime: 0
        },
        lastUpdated: Date.now()
      }
      this.userPreferences.set(interaction.userId, preferences)
    }

    // Update preferred tool types
    if (interaction.toolsSelected && interaction.toolsSelected.length > 0) {
      interaction.toolsSelected.forEach(toolId => {
        if (!preferences!.preferredToolTypes.includes(toolId)) {
          preferences!.preferredToolTypes.push(toolId)
          if (preferences!.preferredToolTypes.length > 20) {
            preferences!.preferredToolTypes.shift()
          }
        }
      })
    }

    // Track frequent queries
    const normalizedQuery = interaction.query.toLowerCase().trim()
    if (!preferences.frequentQueries.includes(normalizedQuery)) {
      preferences.frequentQueries.push(normalizedQuery)
      if (preferences.frequentQueries.length > 20) {
        preferences.frequentQueries.shift()
      }
    }

    // Adapt learning style based on query patterns
    const queryLength = interaction.query.split(' ').length
    if (queryLength > 20) {
      preferences.learningStyle = 'detailed'
    } else if (queryLength < 5) {
      preferences.learningStyle = 'concise'
    }

    // Update interaction patterns
    const userInteractions = this.interactions.filter(i => i.userId === interaction.userId)
    if (userInteractions.length > 0) {
      preferences.interactionPatterns.avgQueryLength = 
        userInteractions.reduce((sum, i) => sum + i.query.length, 0) / userInteractions.length
      
      preferences.interactionPatterns.avgResponseTime =
        userInteractions.reduce((sum, i) => sum + i.timeToResponse, 0) / userInteractions.length
    }

    // Detect expertise level progression
    if (userInteractions.length > 10) {
      const recentQueries = userInteractions.slice(-10)
      const complexQueries = recentQueries.filter(i => i.query.split(' ').length > 15).length
      
      if (complexQueries > 7) {
        preferences.expertiseLevel = 'advanced'
      } else if (complexQueries > 3) {
        preferences.expertiseLevel = 'intermediate'
      } else {
        preferences.expertiseLevel = 'beginner'
      }
    }

    preferences.lastUpdated = Date.now()
  }

  /**
   * Update learning model based on interaction feedback
   */
  private updateLearningModel(interaction: UserInteraction): void {
    // Update intent accuracy
    if (interaction.feedback) {
      const currentAccuracy = this.learningModel.intentAccuracy.get(interaction.intent) || 0.5
      const feedbackScore = interaction.feedback === 'positive' ? 1 : 
                           interaction.feedback === 'neutral' ? 0.5 : 0
      
      // Moving average: 80% historical + 20% new feedback
      const newAccuracy = currentAccuracy * 0.8 + feedbackScore * 0.2
      this.learningModel.intentAccuracy.set(interaction.intent, newAccuracy)
    }

    // Update tool recommendation success
    if (interaction.toolsRecommended && interaction.toolsSelected) {
      interaction.toolsRecommended.forEach(toolId => {
        const wasSelected = interaction.toolsSelected!.includes(toolId)
        const currentSuccess = this.learningModel.toolRecommendationSuccess.get(toolId) || 0.5
        
        const newSuccess = currentSuccess * 0.9 + (wasSelected ? 1 : 0) * 0.1
        this.learningModel.toolRecommendationSuccess.set(toolId, newSuccess)
      })
    }

    // Update response effectiveness
    if (interaction.userSatisfaction) {
      const responsePattern = this.getResponsePattern(interaction.responseProvided)
      const currentEffectiveness = this.learningModel.responseEffectiveness.get(responsePattern) || 0.5
      const satisfactionScore = interaction.userSatisfaction / 5
      
      const newEffectiveness = currentEffectiveness * 0.85 + satisfactionScore * 0.15
      this.learningModel.responseEffectiveness.set(responsePattern, newEffectiveness)
    }
  }

  /**
   * Extract response pattern for effectiveness tracking
   */
  private getResponsePattern(response: string): string {
    // Simple pattern extraction based on response structure
    if (response.includes('Here are') || response.includes('I found')) {
      return 'list_response'
    } else if (response.includes('compare') || response.includes('comparison')) {
      return 'comparison_response'
    } else if (response.includes('recommend')) {
      return 'recommendation_response'
    }
    return 'general_response'
  }

  /**
   * Load learning data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const interactionsData = localStorage.getItem(this.INTERACTION_STORAGE_KEY)
      if (interactionsData) {
        this.interactions = JSON.parse(interactionsData)
      }
      
      const preferencesData = localStorage.getItem(this.PREFERENCES_STORAGE_KEY)
      if (preferencesData) {
        const prefsArray = JSON.parse(preferencesData)
        this.userPreferences = new Map(prefsArray)
      }
      
      this.rebuildLearningModel()
    } catch (error) {
      console.error('Failed to load learning data:', error)
    }
  }

  /**
   * Save learning data to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(
        this.INTERACTION_STORAGE_KEY,
        JSON.stringify(this.interactions)
      )
      
      const prefsArray = Array.from(this.userPreferences.entries())
      localStorage.setItem(
        this.PREFERENCES_STORAGE_KEY,
        JSON.stringify(prefsArray)
      )
    } catch (error) {
      console.error('Failed to save learning data:', error)
    }
  }

  /**
   * Rebuild learning model from historical interactions
   */
  private rebuildLearningModel(): void {
    this.interactions.forEach(interaction => {
      this.updateLearningModel(interaction)
    })
  }

  /**
   * Export learning data for analysis
   */
  exportLearningData(): string {
    const data = {
      interactions: this.interactions,
      preferences: Array.from(this.userPreferences.entries()),
      model: {
        intentAccuracy: Array.from(this.learningModel.intentAccuracy.entries()),
        responseEffectiveness: Array.from(this.learningModel.responseEffectiveness.entries()),
        toolRecommendationSuccess: Array.from(
          this.learningModel.toolRecommendationSuccess.entries()
        ),
        commonMisclassifications: this.learningModel.commonMisclassifications,
        improvementMetrics: this.learningModel.improvementMetrics
      },
      analysis: this.analyzeLearningPatterns(),
      exportedAt: new Date().toISOString()
    }
    
    return JSON.stringify(data, null, 2)
  }

  /**
   * Clear all learning data
   */
  clearLearningData(): void {
    this.interactions = []
    this.userPreferences.clear()
    this.learningModel = {
      intentAccuracy: new Map(),
      responseEffectiveness: new Map(),
      toolRecommendationSuccess: new Map(),
      commonMisclassifications: [],
      improvementMetrics: {
        totalFeedback: 0,
        positiveFeedback: 0,
        negativeFeedback: 0,
        averageSatisfaction: 0
      }
    }
    
    localStorage.removeItem(this.INTERACTION_STORAGE_KEY)
    localStorage.removeItem(this.PREFERENCES_STORAGE_KEY)
  }

  /**
   * Get recent interactions for context
   */
  getRecentInteractions(userId: string, limit: number = 5): UserInteraction[] {
    return this.interactions
      .filter(i => i.userId === userId)
      .slice(-limit)
  }
  
  /**
   * Get all interactions (for analytics)
   */
  getInteractions(): UserInteraction[] {
    return [...this.interactions]
  }
  
  /**
   * Get the learning model (for analytics)
   */
  getLearningModel(): LearningModel {
    return {
      intentAccuracy: this.learningModel.intentAccuracy,
      responseEffectiveness: this.learningModel.responseEffectiveness,
      toolRecommendationSuccess: this.learningModel.toolRecommendationSuccess,
      commonMisclassifications: [...this.learningModel.commonMisclassifications],
      improvementMetrics: { ...this.learningModel.improvementMetrics }
    }
  }
}

// Singleton instance
export const learningService = new LearningService()
