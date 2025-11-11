export enum UserIntent {
  TOOL_RECOMMENDATION = 'tool_recommendation',
  TOOL_COMPARISON = 'tool_comparison',
  ANALYTICS_QUERY = 'analytics_query',
  PLATFORM_HELP = 'platform_help',
  TOOL_DETAILS = 'tool_details',
  GENERAL_QUESTION = 'general_question',
  GREETING = 'greeting',
  SUGGESTION = 'suggestion',
  THANK_YOU = 'thank_you',
  GOODBYE = 'goodbye'
}

export interface Intent {
  type: UserIntent
  confidence: number
  entities: Record<string, any>
}

export class IntentClassifier {
  classify(message: string): Intent {
    const lowerMsg = message.toLowerCase().trim()
    
    // Greeting patterns (highest priority - should be quick)
    if (this.matchesGreeting(lowerMsg)) {
      return { type: UserIntent.GREETING, confidence: 0.95, entities: {} }
    }
    
    // Thank you patterns
    if (this.matchesThankYou(lowerMsg)) {
      return { type: UserIntent.THANK_YOU, confidence: 0.95, entities: {} }
    }
    
    // Goodbye patterns
    if (this.matchesGoodbye(lowerMsg)) {
      return { type: UserIntent.GOODBYE, confidence: 0.95, entities: {} }
    }
    
    // Company/General knowledge questions (before tool details to catch "tell me about Sanofi")
    if (this.matchesGeneralKnowledge(lowerMsg)) {
      return { type: UserIntent.GENERAL_QUESTION, confidence: 0.9, entities: {} }
    }
    
    // Tool recommendation patterns
    if (this.matchesRecommendation(lowerMsg)) {
      return {
        type: UserIntent.TOOL_RECOMMENDATION,
        confidence: 0.9,
        entities: this.extractRecommendationEntities(lowerMsg)
      }
    }
    
    // Comparison patterns
    if (this.matchesComparison(lowerMsg)) {
      return {
        type: UserIntent.TOOL_COMPARISON,
        confidence: 0.85,
        entities: this.extractComparisonEntities(lowerMsg)
      }
    }
    
    // Analytics patterns
    if (this.matchesAnalytics(lowerMsg)) {
      return {
        type: UserIntent.ANALYTICS_QUERY,
        confidence: 0.85,
        entities: this.extractAnalyticsEntities(lowerMsg)
      }
    }
    
    // Tool details
    if (this.matchesToolDetails(lowerMsg)) {
      return {
        type: UserIntent.TOOL_DETAILS,
        confidence: 0.8,
        entities: this.extractToolName(lowerMsg)
      }
    }
    
    // Platform help
    if (this.matchesPlatformHelp(lowerMsg)) {
      return {
        type: UserIntent.PLATFORM_HELP,
        confidence: 0.75,
        entities: this.extractPlatformFeature(lowerMsg)
      }
    }
    
    // Suggestion
    if (this.matchesSuggestion(lowerMsg)) {
      return {
        type: UserIntent.SUGGESTION,
        confidence: 0.8,
        entities: {}
      }
    }
    
    // Default
    return { type: UserIntent.GENERAL_QUESTION, confidence: 0.5, entities: {} }
  }
  
  private matchesGreeting(msg: string): boolean {
    const patterns = [
      /^(hi|hello|hey|greetings|good (morning|afternoon|evening)|howdy|sup|what's up|yo)[\s\!\?\.]*$/i,
      /^(hi|hello|hey) (there|sona|assistant)[\s\!\?\.]*$/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private matchesThankYou(msg: string): boolean {
    const patterns = [
      /^(thank you|thanks|thx|ty|thank u|merci|gracias|danke|obrigado|谢谢|ありがとう|cảm ơn)[\s\!\?\.]*$/i,
      /^(thank you|thanks) (so much|very much|a lot)[\s\!\?\.]*$/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private matchesGoodbye(msg: string): boolean {
    const patterns = [
      /^(bye|goodbye|see you|see ya|later|cya|talk to you later|ttyl|au revoir|adiós|auf wiedersehen|adeus|再见|さようなら|tạm biệt)[\s\!\?\.]*$/i,
      /^(good)?bye[\s\!\?\.]*$/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private matchesGeneralKnowledge(msg: string): boolean {
    // Match questions about Sanofi, the company, AI concepts, jokes, facts etc.
    const patterns = [
      /\b(tell me about|what is|what's|about|info on|information about)\b.*\b(sanofi|company)\b/i,
      /\b(what is|what's)\b.*\b(ai|artificial intelligence|machine learning|ml)\b/i,
      /\bhow does\b.*\b(ai|artificial intelligence|machine learning)\b.*\bwork\b/i,
      /\b(sanofi|company)\b.*\b(news|update|recent|latest)\b/i,
      /\b(tell|give|share).*\b(me|us)\b.*\b(a |an )?(joke|funny|humor|laugh)\b/i,
      /\b(tell|give|share).*\b(me|us)\b.*\b(a |an )?(fact|trivia|fun fact|interesting fact)\b/i,
      /\b(joke|funny|humor|laugh)\b/i,
      /\b(fact|trivia|fun fact|interesting fact|did you know)\b/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private matchesRecommendation(msg: string): boolean {
    const patterns = [
      /\b(recommend|suggest|find|need|want|looking for|search for|show me|give me)\b.*\btool(s)?\b/i,
      /\b(best|good|right|perfect|ideal)\b.*\btool(s)?\b.*\b(for|to)\b/i,
      /\bhelp me (find|choose|select|pick)\b/i,
      /\bwhat (tool|should|can|would) .*(use|help|work|recommend)/i,
      /\bi (need|want|am looking for)\b.*\b(to|for)\b/i,
      /\bwhich tool(s)?\b/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private matchesComparison(msg: string): boolean {
    const patterns = [
      /\b(compare|comparison|difference|versus|vs|better than|or)\b/i,
      /\bwhat'?s? the difference between\b/i,
      /\b\w+\s+(vs|versus|compared to|or)\s+\w+/i,
      /\bwhich (is|one is) (better|best)\b/i,
      /\b(pros and cons|advantages|disadvantages)\b/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private matchesAnalytics(msg: string): boolean {
    const patterns = [
      /\b(how many|how much|statistics|stats|analytics|metrics|numbers|count|total)\b/i,
      /\b(show|give|tell) me (the )?(data|numbers|stats|breakdown|overview)\b/i,
      /\b(most|top|least|bottom|popular|used|common)\b/i,
      /\bwhat (percentage|percent|ratio)\b/i,
      /\b(internal|external) (vs|versus|compared to)\b/i,
      /\b(capability|technology|use case|category) (breakdown|distribution|stats)\b/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private matchesToolDetails(msg: string): boolean {
    // Exclude AI Compass platform queries - these should go to PLATFORM_HELP
    if (/\b(ai\s*compass|platform)\b.*\bfeature/i.test(msg) || 
        /\babout\s+(ai\s*compass|the\s*platform)/i.test(msg)) {
      return false
    }
    
    const patterns = [
      /\b(tell me|explain|describe|info|information|details|more)\b.*\babout\b/i,
      /\bwhat is\b/i,
      /\bhow does .* work\b/i,
      /\bwhat can .* do\b/i,
      /\bfeatures of\b/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private matchesPlatformHelp(msg: string): boolean {
    // Explicitly detect AI Compass feature queries
    if (/\b(ai\s*compass|platform)\b.*\bfeature/i.test(msg) || 
        /\babout\s+(ai\s*compass|the\s*platform)/i.test(msg) ||
        /\btell me about ai compass/i.test(msg)) {
      return true
    }
    
    const patterns = [
      /\bhow (do i|to|can i)\b/i,
      /\b(help|guide|tutorial|instructions|where)\b/i,
      /\b(search|filter|compare|analytics|suggestion|dark mode|language)\b/i,
      /\bwhere (is|can i find|do i)\b/i,
      /\b(use|access|open|view)\b.*\b(feature|page|section|dashboard)\b/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private matchesSuggestion(msg: string): boolean {
    const patterns = [
      /\b(submit|send|share|give) (a )?(suggestion|idea|feedback|feature request)\b/i,
      /\bi (suggest|recommend|think you should)\b/i,
      /\b(add|include|would like to see)\b/i
    ]
    return patterns.some(p => p.test(msg))
  }
  
  private extractRecommendationEntities(msg: string): Record<string, any> {
    const entities: Record<string, any> = {}
    
    console.log('🔍 DEBUG - Intent Classifier - Message:', msg)
    
    // Extract use case or purpose
    const forMatch = msg.match(/\b(for|to)\s+([\w\s]+?)(?:\s+\.|$|\?)/i)
    if (forMatch) {
      entities.useCase = forMatch[2].trim()
      console.log('🔍 DEBUG - Use case found:', entities.useCase)
    }
    
    // Extract capabilities needed - ENHANCED with more keywords
    console.log('🔍 DEBUG - Testing image pattern on:', msg)
    const imagePattern = /\b(image|picture|photo|visual|graphic|diagram|art|illustration|design|content creation|creative content|media)\b/i
    const imageTest = imagePattern.test(msg)
    console.log('🔍 DEBUG - Image pattern result:', imageTest)
    
    if (/\b(code|coding|programming|development|script|developer|software|app|application|build)\b/i.test(msg)) {
      entities.needsCodeGen = true
      entities.capability = 'code generation'
      console.log('🔍 DEBUG - Code generation detected')
    }
    if (imageTest) {
      entities.needsImageGen = true
      entities.capability = 'image generation'
      console.log('🔍 DEBUG - Image generation detected - needsImageGen set to:', entities.needsImageGen)
    }
    if (/\b(search|web|internet|real-time|live|browse|lookup)\b/i.test(msg)) {
      entities.needsWebSearch = true
      entities.capability = 'web search'
    }
    if (/\b(chat|conversation|talk|discuss|dialogue|conversational)\b/i.test(msg)) {
      entities.needsChat = true
      entities.capability = 'chat'
    }
    if (/\b(data|analytics|analysis|insights|report|statistics|metrics)\b/i.test(msg)) {
      entities.needsDataAnalysis = true
      entities.capability = 'data analysis'
    }
    if (/\b(document|pdf|file|text|reading|processing)\b/i.test(msg)) {
      entities.needsDocAnalysis = true
      entities.capability = 'document analysis'
    }
    if (/\b(write|writing|content|text generation|article|blog)\b/i.test(msg)) {
      entities.needsTextGen = true
      entities.capability = 'text generation'
    }
    
    // Extract user type or department
    if (/\b(research|r&d|scientist|lab)\b/i.test(msg)) {
      entities.userType = 'research'
    }
    if (/\b(commercial|sales|marketing)\b/i.test(msg)) {
      entities.userType = 'commercial'
    }
    if (/\b(manufacturing|production|quality|gmp)\b/i.test(msg)) {
      entities.userType = 'manufacturing'
    }
    if (/\b(medical|regulatory|compliance)\b/i.test(msg)) {
      entities.userType = 'medical'
    }
    
    // Extract tool type preference
    if (/\binternal\b/i.test(msg)) {
      entities.preferInternal = true
    }
    if (/\bexternal\b/i.test(msg)) {
      entities.preferExternal = true
    }
    
    return entities
  }
  
  private extractComparisonEntities(msg: string): Record<string, any> {
    const entities: Record<string, any> = {}
    
    // Extract tool names for comparison - try multiple patterns
    const toolNames: string[] = []
    
    // Pattern 1: "compare X, Y, Z" or "compare X, Y and Z" (comma-separated list)
    const compareListMatch = msg.match(/compare\s+(.+?)(?:\s*[.?!]|$)/i)
    if (compareListMatch) {
      const toolsText = compareListMatch[1]
      // Split by comma, "and", or both
      const parts = toolsText.split(/,\s*(?:and\s+)?|,\s+|\s+and\s+/i)
      if (parts.length >= 2) {
        toolNames.push(...parts.map(p => p.trim()))
      } else {
        // Fallback: try "compare X and Y" or "compare X vs Y"
        const binaryMatch = toolsText.match(/([^,]+?)\s+(and|vs|versus|to)\s+(.+)/i)
        if (binaryMatch) {
          toolNames.push(binaryMatch[1].trim())
          toolNames.push(binaryMatch[3].trim())
        }
      }
    }
    
    // Pattern 2: "X vs Y" or "X versus Y" or "X or Y" (binary comparison)
    if (toolNames.length === 0) {
      const vsMatch = msg.match(/(\w+(?:\s+\w+)?)\s+(vs|versus|compared to|or)\s+(\w+(?:\s+\w+)?)/i)
      if (vsMatch) {
        toolNames.push(vsMatch[1].trim())
        toolNames.push(vsMatch[3].trim())
      }
    }
    
    // Pattern 3: "difference between X and Y"
    if (toolNames.length === 0) {
      const diffMatch = msg.match(/difference\s+between\s+([^,]+?)\s+and\s+(.+?)(?:\s*[.?!]|$)/i)
      if (diffMatch) {
        toolNames.push(diffMatch[1].trim())
        toolNames.push(diffMatch[2].trim())
      }
    }
    
    // Clean up tool names (remove common words)
    const cleanedNames = toolNames.map(name => 
      name.replace(/\b(the|a|an|tool)\b/gi, '').trim()
    ).filter(name => name.length > 0)
    
    if (cleanedNames.length >= 2) {
      entities.toolNames = cleanedNames
    }
    
    // Extract comparison aspect
    if (/\bfeature(s)?\b/i.test(msg)) {
      entities.compareBy = 'features'
    }
    if (/\b(cost|price|pricing)\b/i.test(msg)) {
      entities.compareBy = 'cost'
    }
    if (/\bcapabilit(y|ies)\b/i.test(msg)) {
      entities.compareBy = 'capabilities'
    }
    
    return entities
  }
  
  private extractAnalyticsEntities(msg: string): Record<string, any> {
    const entities: Record<string, any> = {}
    
    // Extract metric type
    if (/\b(internal|external)\b/i.test(msg)) {
      entities.metricType = 'toolType'
    }
    if (/\bcapabilit(y|ies)\b/i.test(msg)) {
      entities.metricType = 'capabilities'
    }
    if (/\btechnolog(y|ies)\b/i.test(msg)) {
      entities.metricType = 'technology'
    }
    if (/\b(use case|purpose)\b/i.test(msg)) {
      entities.metricType = 'useCase'
    }
    
    // Extract comparison dimension
    if (/\binternal\s+(vs|versus)\s+external\b/i.test(msg)) {
      entities.comparison = 'internal_vs_external'
    }
    
    return entities
  }
  
  private extractToolName(msg: string): Record<string, any> {
    // Extract potential tool name (capitalized words or quoted text)
    const quotedMatch = msg.match(/["']([^"']+)["']/i)
    if (quotedMatch) {
      return { toolName: quotedMatch[1] }
    }
    
    const capitalizedMatch = msg.match(/\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b/)
    if (capitalizedMatch) {
      return { toolName: capitalizedMatch[1] }
    }
    
    // Extract from "about X" pattern
    const aboutMatch = msg.match(/\babout\s+([\w\s]+?)(?:\?|$|\s+and\b|\s+or\b)/i)
    if (aboutMatch) {
      return { toolName: aboutMatch[1].trim() }
    }
    
    return {}
  }
  
  private extractPlatformFeature(msg: string): Record<string, any> {
    const entities: Record<string, any> = {}
    
    // Check for "How do I access [tool]?" queries
    if (/\bhow (do i|to|can i)? ?(access|get to|use|open)\b/i.test(msg)) {
      entities.feature = 'tool_access'
      
      // Extract tool name after "access/get to/use/open"
      const accessMatch = msg.match(/\b(access|get to|use|open)\s+([a-z0-9\s\-]+?)(\?|$|\.)/i)
      if (accessMatch && accessMatch[2]) {
        entities.toolName = accessMatch[2].trim()
      }
    }
    
    if (/\b(search|find|filter)\b/i.test(msg)) {
      entities.feature = 'search'
    }
    if (/\bcompare|comparison\b/i.test(msg)) {
      entities.feature = 'comparison'
    }
    if (/\banalytics|dashboard|stats\b/i.test(msg)) {
      entities.feature = 'analytics'
    }
    if (/\bsuggestion|suggest|feedback\b/i.test(msg)) {
      entities.feature = 'suggestion'
    }
    if (/\b(dark mode|theme|light mode)\b/i.test(msg)) {
      entities.feature = 'theme'
    }
    if (/\blanguage|translate\b/i.test(msg)) {
      entities.feature = 'language'
    }
    
    return entities
  }
}
