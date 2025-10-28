export type Msg = { 
  role: 'user' | 'assistant'
  content: string
  feedback?: 'positive' | 'negative'
  timestamp?: string
}

export type FeedbackEntry = {
  query: string
  response: string
  feedback: 'positive' | 'negative'
  timestamp: string
  toolUsed?: string
  context?: string
  // Optional metadata to help with review/triage
  reason?: string
  messageId?: string
  userId?: string
}

export type LearningModel = {
  successfulPatterns: Map<string, number>  // Query patterns that got positive feedback
  failedPatterns: Map<string, number>      // Query patterns that got negative feedback
  totalFeedback: number
  positiveCount: number
  negativeCount: number
}

export type UserProfile = {
  name?: string
  department?: string
  interests: string[]
  commonQueries: string[]
  toolsAskedAbout: string[]
  conversationStyle: 'formal' | 'casual' | 'technical'
  lastInteraction?: string
  feedbackHistory?: FeedbackEntry[]
}

export type ToolResult<T = any> = { ok: boolean, data?: T, error?: string, meta?: Record<string, any> }
