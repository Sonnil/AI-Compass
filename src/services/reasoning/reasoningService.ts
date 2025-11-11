/**
 * Reasoning Service for SONA Agent
 * 
 * Provides multi-step reasoning, chain-of-thought processing, and logical inference
 * to help SONA understand complex queries and provide better responses.
 */

import type { Tool } from '../../types'
import type { Intent } from '../../features/sona/services/intentClassifier'

export interface ReasoningStep {
  step: number
  type: 'analysis' | 'inference' | 'validation' | 'synthesis'
  description: string
  input: any
  output: any
  confidence: number
  reasoning: string
}

export interface ReasoningChain {
  id: string
  query: string
  steps: ReasoningStep[]
  conclusion: string
  overallConfidence: number
  timestamp: number
}

export interface ContextualKnowledge {
  facts: string[]
  relationships: Map<string, string[]>
  constraints: string[]
}

class ReasoningService {
  private reasoningHistory: ReasoningChain[] = []
  private readonly MAX_HISTORY = 100

  /**
   * Perform multi-step reasoning on a user query
   */
  reason(
    query: string,
    intent: Intent,
    tools: Tool[],
    context?: {
      previousQueries?: string[]
      userExpertise?: 'beginner' | 'intermediate' | 'advanced'
    }
  ): ReasoningChain {
    const chain: ReasoningChain = {
      id: this.generateId(),
      query,
      steps: [],
      conclusion: '',
      overallConfidence: 0,
      timestamp: Date.now()
    }

    // Step 1: Analyze query structure and complexity
    const analysisStep = this.analyzeQueryStructure(query, intent)
    chain.steps.push(analysisStep)

    // Step 2: Infer user goals and requirements
    const inferenceStep = this.inferUserGoals(query, intent, context)
    chain.steps.push(inferenceStep)

    // Step 3: Match against available tools
    const matchingStep = this.matchToolsToRequirements(
      inferenceStep.output.requirements,
      tools
    )
    chain.steps.push(matchingStep)

    // Step 4: Validate recommendations
    const validationStep = this.validateRecommendations(
      matchingStep.output.matches,
      inferenceStep.output.requirements,
      context?.userExpertise
    )
    chain.steps.push(validationStep)

    // Step 5: Synthesize final response
    const synthesisStep = this.synthesizeResponse(
      validationStep.output.validated,
      intent,
      context
    )
    chain.steps.push(synthesisStep)

    // Calculate overall confidence
    chain.overallConfidence = this.calculateOverallConfidence(chain.steps)
    chain.conclusion = synthesisStep.output.response

    // Store in history
    this.reasoningHistory.push(chain)
    if (this.reasoningHistory.length > this.MAX_HISTORY) {
      this.reasoningHistory.shift()
    }

    return chain
  }

  /**
   * Step 1: Analyze query structure and complexity
   */
  private analyzeQueryStructure(query: string, intent: Intent): ReasoningStep {
    const words = query.toLowerCase().split(/\s+/)
    const sentences = query.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    // Detect query type
    const isQuestion = query.includes('?') || 
                      words.some(w => ['what', 'how', 'why', 'when', 'where', 'which', 'who'].includes(w))
    const isComparison = words.some(w => ['compare', 'versus', 'vs', 'difference', 'better'].includes(w))
    const isMultiPart = sentences.length > 1 || query.includes('and') || query.includes('also')
    
    // Complexity score
    const complexityFactors = {
      length: words.length > 20 ? 2 : words.length > 10 ? 1 : 0,
      multiPart: isMultiPart ? 1 : 0,
      technicalTerms: this.countTechnicalTerms(words),
      comparison: isComparison ? 1 : 0
    }
    
    const complexity = Object.values(complexityFactors).reduce((a, b) => a + b, 0) / 5

    return {
      step: 1,
      type: 'analysis',
      description: 'Analyze query structure and complexity',
      input: { query, intent },
      output: {
        wordCount: words.length,
        sentenceCount: sentences.length,
        isQuestion,
        isComparison,
        isMultiPart,
        complexity,
        queryType: isComparison ? 'comparison' : isQuestion ? 'question' : 'statement'
      },
      confidence: 0.95,
      reasoning: `Query has ${words.length} words, ${sentences.length} sentence(s). ` +
                `Type: ${isComparison ? 'comparison' : isQuestion ? 'question' : 'statement'}. ` +
                `Complexity: ${(complexity * 100).toFixed(0)}%`
    }
  }

  /**
   * Step 2: Infer user goals and requirements
   */
  private inferUserGoals(
    query: string,
    intent: Intent,
    context?: {
      previousQueries?: string[]
      userExpertise?: 'beginner' | 'intermediate' | 'advanced'
    }
  ): ReasoningStep {
    const requirements: string[] = []
    const goals: string[] = []
    const constraints: string[] = []

    const lowerQuery = query.toLowerCase()

    // Infer primary goal from intent
    switch (intent.type) {
      case 'tool_recommendation':
        goals.push('find appropriate tools')
        break
      case 'tool_comparison':
        goals.push('compare multiple tools')
        requirements.push('at least 2 tools to compare')
        break
      case 'analytics_query':
        goals.push('get data insights')
        requirements.push('numerical analysis')
        break
      case 'platform_help':
        goals.push('understand platform features')
        break
    }

    // Infer requirements from query
    if (lowerQuery.includes('real-time') || lowerQuery.includes('live')) {
      requirements.push('real-time capability')
    }
    if (lowerQuery.includes('code') || lowerQuery.includes('programming')) {
      requirements.push('code generation')
    }
    if (lowerQuery.includes('image') || lowerQuery.includes('visual')) {
      requirements.push('image generation')
    }
    if (lowerQuery.includes('free') || lowerQuery.includes('cost')) {
      constraints.push('cost consideration')
    }
    if (lowerQuery.includes('internal') || lowerQuery.includes('sanofi')) {
      constraints.push('internal tools only')
    }

    // Adjust for user expertise
    if (context?.userExpertise === 'beginner') {
      requirements.push('beginner-friendly')
      constraints.push('avoid complex tools')
    } else if (context?.userExpertise === 'advanced') {
      requirements.push('advanced features')
    }

    // Consider previous context
    if (context?.previousQueries && context.previousQueries.length > 0) {
      goals.push('maintain conversation continuity')
    }

    const confidence = requirements.length > 0 ? 0.85 : 0.7

    return {
      step: 2,
      type: 'inference',
      description: 'Infer user goals and requirements',
      input: { query, intent, context },
      output: {
        goals,
        requirements,
        constraints
      },
      confidence,
      reasoning: `Identified ${goals.length} goal(s), ${requirements.length} requirement(s), ` +
                `and ${constraints.length} constraint(s) based on intent and query analysis.`
    }
  }

  /**
   * Step 3: Match tools to requirements
   */
  private matchToolsToRequirements(
    requirements: {
      goals: string[]
      requirements: string[]
      constraints: string[]
    },
    tools: Tool[]
  ): ReasoningStep {
    const matches: Array<{ tool: Tool; score: number; reasons: string[] }> = []

    tools.forEach(tool => {
      let score = 0
      const reasons: string[] = []

      // Check requirements
      requirements.requirements.forEach(req => {
        if (req === 'real-time capability' && tool.realTimeWebSearch) {
          score += 3
          reasons.push('Has real-time web search')
        }
        if (req === 'code generation' && tool.capabilities?.codeGeneration) {
          score += 3
          reasons.push('Supports code generation')
        }
        if (req === 'image generation' && tool.imageGeneration) {
          score += 3
          reasons.push('Supports image generation')
        }
        if (req === 'beginner-friendly' && tool.primaryPurpose) {
          score += 1
          reasons.push('Has clear use case description')
        }
      })

      // Check constraints
      requirements.constraints.forEach(constraint => {
        if (constraint === 'internal tools only' && tool.type === 'internal') {
          score += 2
          reasons.push('Internal Sanofi tool')
        }
        if (constraint === 'cost consideration' && tool.cost?.toLowerCase().includes('free')) {
          score += 2
          reasons.push('Free or low cost')
        }
      })

      // Base relevance score
      if (tool.projectStatus === 'Production') {
        score += 1
        reasons.push('Production-ready')
      }

      if (score > 0) {
        matches.push({ tool, score, reasons })
      }
    })

    // Sort by score
    matches.sort((a, b) => b.score - a.score)

    return {
      step: 3,
      type: 'inference',
      description: 'Match tools to requirements',
      input: { requirements, toolCount: tools.length },
      output: {
        matches: matches.slice(0, 10), // Top 10 matches
        totalMatches: matches.length
      },
      confidence: matches.length > 0 ? 0.9 : 0.5,
      reasoning: `Found ${matches.length} matching tools out of ${tools.length} available. ` +
                `Top match score: ${matches[0]?.score || 0}`
    }
  }

  /**
   * Step 4: Validate recommendations
   */
  private validateRecommendations(
    matches: Array<{ tool: Tool; score: number; reasons: string[] }>,
    requirements: {
      goals: string[]
      requirements: string[]
      constraints: string[]
    },
    userExpertise?: 'beginner' | 'intermediate' | 'advanced'
  ): ReasoningStep {
    const validated: Array<{
      tool: Tool
      score: number
      reasons: string[]
      validationNotes: string[]
    }> = []

    matches.forEach(match => {
      const validationNotes: string[] = []
      let adjustedScore = match.score

      // Validate against requirements
      const meetsRequirements = requirements.requirements.every(req => {
        if (req === 'real-time capability') {
          return !!match.tool.realTimeWebSearch
        }
        if (req === 'code generation') {
          return !!match.tool.capabilities?.codeGeneration
        }
        if (req === 'image generation') {
          return !!match.tool.imageGeneration
        }
        return true
      })

      if (!meetsRequirements) {
        adjustedScore *= 0.7
        validationNotes.push('Does not meet all requirements')
      } else {
        validationNotes.push('Meets all requirements')
      }

      // Validate for user expertise
      if (userExpertise === 'beginner') {
        if (match.tool.bestUseCase && match.tool.bestUseCase.length > 0) {
          adjustedScore += 1
          validationNotes.push('Good for beginners - clear use case')
        }
      } else if (userExpertise === 'advanced') {
        if (match.tool.projectStatus === 'Development') {
          adjustedScore += 0.5
          validationNotes.push('Cutting-edge tool for advanced users')
        }
      }

      // Check availability
      if (match.tool.projectStatus === 'Production') {
        validationNotes.push('Currently available')
      } else if (match.tool.projectStatus === 'Development') {
        adjustedScore *= 0.8
        validationNotes.push('In development - limited availability')
      }

      validated.push({
        ...match,
        score: adjustedScore,
        validationNotes
      })
    })

    // Re-sort after validation
    validated.sort((a, b) => b.score - a.score)

    return {
      step: 4,
      type: 'validation',
      description: 'Validate recommendations',
      input: { matches, requirements, userExpertise },
      output: {
        validated: validated.slice(0, 5) // Top 5 validated
      },
      confidence: 0.88,
      reasoning: `Validated ${validated.length} tools. Adjusted scores based on ` +
                `requirements compliance and user expertise level.`
    }
  }

  /**
   * Step 5: Synthesize final response
   */
  private synthesizeResponse(
    validated: Array<{
      tool: Tool
      score: number
      reasons: string[]
      validationNotes: string[]
    }>,
    intent: Intent,
    context?: {
      previousQueries?: string[]
      userExpertise?: 'beginner' | 'intermediate' | 'advanced'
    }
  ): ReasoningStep {
    let response = ''

    if (validated.length === 0) {
      response = "I couldn't find any tools that match your specific requirements. " +
                "Could you provide more details about what you're looking for?"
    } else {
      // Build response based on intent and matches
      const topTool = validated[0]
      const expertise = context?.userExpertise || 'intermediate'

      if (expertise === 'beginner') {
        response = `Based on your needs, I recommend **${topTool.tool.name}**. `
        response += `It's great for: ${topTool.tool.bestUseCase}. `
        if (topTool.validationNotes.length > 0) {
          response += `Why it's a good fit: ${topTool.validationNotes.join(', ')}. `
        }
      } else {
        response = `I've analyzed your requirements and found ${validated.length} matching tool(s). `
        response += `Top recommendation: **${topTool.tool.name}** (confidence: ${(topTool.score / 10 * 100).toFixed(0)}%). `
        
        if (topTool.reasons.length > 0) {
          response += `Key features: ${topTool.reasons.join(', ')}. `
        }
      }

      if (validated.length > 1) {
        response += `\n\nOther options to consider: `
        validated.slice(1, 3).forEach((match, idx) => {
          response += `\n${idx + 2}. **${match.tool.name}** - ${match.reasons[0] || 'Relevant match'}`
        })
      }
    }

    return {
      step: 5,
      type: 'synthesis',
      description: 'Synthesize final response',
      input: { validated, intent, context },
      output: {
        response,
        toolCount: validated.length,
        primaryRecommendation: validated[0]?.tool.name
      },
      confidence: validated.length > 0 ? 0.92 : 0.6,
      reasoning: `Synthesized response for ${context?.userExpertise || 'intermediate'} user ` +
                `with ${validated.length} validated recommendations.`
    }
  }

  /**
   * Calculate overall confidence from all steps
   */
  private calculateOverallConfidence(steps: ReasoningStep[]): number {
    if (steps.length === 0) return 0
    
    const totalConfidence = steps.reduce((sum, step) => sum + step.confidence, 0)
    return totalConfidence / steps.length
  }

  /**
   * Count technical terms in query
   */
  private countTechnicalTerms(words: string[]): number {
    const technicalTerms = [
      'api', 'integration', 'ml', 'ai', 'algorithm', 'data', 'analytics',
      'platform', 'cloud', 'database', 'framework', 'library', 'sdk',
      'deployment', 'pipeline', 'workflow', 'automation', 'optimization'
    ]
    
    return words.filter(w => technicalTerms.includes(w.toLowerCase())).length
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `reasoning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get reasoning history
   */
  getReasoningHistory(): ReasoningChain[] {
    return [...this.reasoningHistory]
  }

  /**
   * Get most recent reasoning chain
   */
  getLastReasoning(): ReasoningChain | undefined {
    return this.reasoningHistory[this.reasoningHistory.length - 1]
  }

  /**
   * Export reasoning chain as readable text
   */
  exportReasoningChain(chain: ReasoningChain): string {
    let output = `=== REASONING CHAIN ===\n`
    output += `Query: "${chain.query}"\n`
    output += `Timestamp: ${new Date(chain.timestamp).toLocaleString()}\n`
    output += `Overall Confidence: ${(chain.overallConfidence * 100).toFixed(1)}%\n\n`

    chain.steps.forEach(step => {
      output += `--- Step ${step.step}: ${step.description} (${step.type}) ---\n`
      output += `Confidence: ${(step.confidence * 100).toFixed(1)}%\n`
      output += `Reasoning: ${step.reasoning}\n`
      output += `Output: ${JSON.stringify(step.output, null, 2)}\n\n`
    })

    output += `=== CONCLUSION ===\n${chain.conclusion}\n`

    return output
  }
}

// Singleton instance
export const reasoningService = new ReasoningService()
