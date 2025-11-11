import type { Tool } from '../../../types'
import type { Intent } from './intentClassifier'
import { UserIntent } from './intentClassifier'
import { AnalyticsQueryService } from './analyticsQueryService'
import { getAICompassFeaturesResponse } from '../knowledge'
import { tracingService, SpanType } from '../../../services/tracing/tracingService'

export interface ResponseContext {
  tools: Tool[]
  language?: string
  conversationHistory?: Array<{ message: string; response: string; timestamp: Date }>
}

export class ResponseGenerator {
  private analyticsService: AnalyticsQueryService
  
  constructor(private context: ResponseContext) {
    this.analyticsService = new AnalyticsQueryService(context.tools)
  }
  
  /**
   * Calculate similarity score between two strings (0-1)
   * Uses Levenshtein distance for fuzzy matching
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase()
    const s2 = str2.toLowerCase()
    
    // Exact match
    if (s1 === s2) return 1.0
    
    // Contains match
    if (s1.includes(s2) || s2.includes(s1)) return 0.8
    
    // Levenshtein distance
    const len1 = s1.length
    const len2 = s2.length
    const matrix: number[][] = []
    
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + cost // substitution
        )
      }
    }
    
    const distance = matrix[len1][len2]
    const maxLen = Math.max(len1, len2)
    return 1 - (distance / maxLen)
  }
  
  /**
   * Find tool by name with fuzzy matching
   * Returns the best match if similarity > 0.6
   */
  private findToolByName(searchName: string): Tool | undefined {
    const normalizedSearch = searchName.toLowerCase()
    
    // First try exact or contains match
    let bestMatch = this.context.tools.find(t => 
      t.name.toLowerCase() === normalizedSearch ||
      t.name.toLowerCase().includes(normalizedSearch) || 
      normalizedSearch.includes(t.name.toLowerCase())
    )
    
    if (bestMatch) return bestMatch
    
    // Try fuzzy matching
    let bestScore = 0
    for (const tool of this.context.tools) {
      const score = this.calculateSimilarity(tool.name, searchName)
      if (score > bestScore) {
        bestScore = score
        bestMatch = tool
      }
    }
    
    // Return best match if similarity is good enough (>60%)
    return bestScore > 0.6 ? bestMatch : undefined
  }
  
  generateResponse(intent: Intent, userMessage: string): string {
    switch (intent.type) {
      case UserIntent.TOOL_RECOMMENDATION:
        return this.handleRecommendation(intent, userMessage)
      
      case UserIntent.TOOL_COMPARISON:
        return this.handleComparison(intent, userMessage)
      
      case UserIntent.ANALYTICS_QUERY:
        return this.handleAnalyticsQuery(intent, userMessage)
      
      case UserIntent.PLATFORM_HELP:
        return this.handlePlatformHelp(intent, userMessage)
      
      case UserIntent.TOOL_DETAILS:
        return this.handleToolDetails(intent, userMessage)
      
      case UserIntent.GREETING:
        return this.handleGreeting(userMessage)
      
      case UserIntent.SUGGESTION:
        return this.handleSuggestion(userMessage)
      
      case UserIntent.GENERAL_QUESTION:
      default:
        return this.handleGeneralQuestion(userMessage)
    }
  }
  
  private handleRecommendation(intent: Intent, message: string): string {
    const entities = intent.entities || {}
    const { 
      useCase, 
      capability,
      needsCodeGen,
      needsImageGen,
      needsWebSearch,
      needsChat,
      needsDataAnalysis,
      needsDocAnalysis,
      needsTextGen,
      preferInternal,
      preferExternal
    } = entities
    
    // DEBUG LOGGING
    console.log('🔍 DEBUG - Recommendation entities:', entities)
    console.log('🔍 DEBUG - needsImageGen:', needsImageGen)
    console.log('🔍 DEBUG - Total tools before filtering:', this.context.tools.length)
    
    // Filter tools based on the request
    let recommendations: Tool[] = this.context.tools
    
    // Filter by tool type preference
    if (preferInternal) {
      recommendations = recommendations.filter(t => t.type === 'internal')
    } else if (preferExternal) {
      recommendations = recommendations.filter(t => t.type === 'external')
    }
    
    // Filter by capability - CHECK ALL CAPABILITY FLAGS
    if (needsCodeGen) {
      recommendations = recommendations.filter(tool => 
        tool.capabilities?.codeGeneration === true
      )
    }
    if (needsImageGen) {
      console.log('🔍 DEBUG - Filtering for image generation...')
      recommendations = recommendations.filter(tool => 
        tool.imageGeneration === true || 
        tool.capabilities?.imageGeneration === true ||
        tool.primaryPurpose?.toLowerCase().includes('image') ||
        tool.primaryPurpose?.toLowerCase().includes('visual') ||
        tool.primaryPurpose?.toLowerCase().includes('content creation') ||
        tool.primaryPurpose?.toLowerCase().includes('content generation') ||
        tool.primaryPurpose?.toLowerCase().includes('creative') ||
        tool.primaryPurpose?.toLowerCase().includes('design') ||
        tool.primaryPurpose?.toLowerCase().includes('graphic') ||
        tool.primaryPurpose?.toLowerCase().includes('media') ||
        tool.salesDescription?.toLowerCase().includes('image generation') ||
        tool.salesDescription?.toLowerCase().includes('visual content') ||
        tool.salesDescription?.toLowerCase().includes('creative content') ||
        tool.name?.toLowerCase().includes('dalle') ||
        tool.name?.toLowerCase().includes('midjourney') ||
        tool.name?.toLowerCase().includes('stable diffusion')
      )
      console.log('🔍 DEBUG - Tools after image filter:', recommendations.length)
      console.log('🔍 DEBUG - Tool names:', recommendations.map(t => t.name).join(', '))
    }
    if (needsWebSearch) {
      recommendations = recommendations.filter(tool => 
        tool.realTimeWebSearch === true || tool.capabilities?.realTimeSearch === true
      )
    }
    if (needsChat) {
      recommendations = recommendations.filter(tool => 
        tool.capabilities?.chat === true
      )
    }
    if (needsDataAnalysis) {
      recommendations = recommendations.filter(tool => 
        tool.capabilities?.dataAnalysis === true ||
        tool.primaryPurpose?.toLowerCase().includes('data') ||
        tool.primaryPurpose?.toLowerCase().includes('analyt') ||
        tool.primaryPurpose?.toLowerCase().includes('insight') ||
        tool.primaryPurpose?.toLowerCase().includes('dashboard') ||
        tool.primaryPurpose?.toLowerCase().includes('visualiz') ||
        tool.primaryPurpose?.toLowerCase().includes('reporting') ||
        tool.primaryPurpose?.toLowerCase().includes('metrics') ||
        tool.primaryPurpose?.toLowerCase().includes('intelligence') ||
        tool.salesDescription?.toLowerCase().includes('data analysis') ||
        tool.salesDescription?.toLowerCase().includes('analytics') ||
        tool.salesDescription?.toLowerCase().includes('business intelligence') ||
        tool.tags?.some(tag => tag.includes('data') || tag.includes('analytics') || tag.includes('bi'))
      )
    }
    if (needsDocAnalysis) {
      recommendations = recommendations.filter(tool => 
        tool.capabilities?.documentAnalysis === true ||
        tool.primaryPurpose?.toLowerCase().includes('document') ||
        tool.primaryPurpose?.toLowerCase().includes('pdf') ||
        tool.salesDescription?.toLowerCase().includes('document')
      )
    }
    if (needsTextGen) {
      recommendations = recommendations.filter(tool => 
        tool.capabilities?.textGeneration === true ||
        tool.capabilities?.codeGeneration === true || // Many code gen tools can also write text
        tool.capabilities?.chat === true || // Chat tools can write
        tool.primaryPurpose?.toLowerCase().includes('writing') ||
        tool.primaryPurpose?.toLowerCase().includes('content') ||
        tool.primaryPurpose?.toLowerCase().includes('text') ||
        tool.primaryPurpose?.toLowerCase().includes('email') ||
        tool.primaryPurpose?.toLowerCase().includes('document creation') ||
        tool.primaryPurpose?.toLowerCase().includes('assistant') ||
        tool.primaryPurpose?.toLowerCase().includes('general') ||
        tool.primaryPurpose?.toLowerCase().includes('productivity') ||
        tool.salesDescription?.toLowerCase().includes('writing') ||
        tool.salesDescription?.toLowerCase().includes('content generation') ||
        tool.salesDescription?.toLowerCase().includes('text generation') ||
        tool.name?.toLowerCase().includes('gpt') ||
        tool.name?.toLowerCase().includes('claude') ||
        tool.name?.toLowerCase().includes('gemini')
      )
    }
    
    // Fallback: if capability keyword but no explicit flag, try keyword matching
    if (!needsCodeGen && !needsImageGen && !needsWebSearch && !needsChat && !needsDataAnalysis && !needsDocAnalysis && !needsTextGen && capability) {
      const cap = capability.toLowerCase()
      recommendations = recommendations.filter(tool => {
        if (cap.includes('code') || cap.includes('programming') || cap.includes('development')) {
          return tool.capabilities?.codeGeneration === true
        }
        if (cap.includes('image') || cap.includes('visual') || cap.includes('photo')) {
          return tool.imageGeneration === true || tool.capabilities?.imageGeneration === true
        }
        if (cap.includes('search') || cap.includes('web') || cap.includes('internet')) {
          return tool.realTimeWebSearch === true || tool.capabilities?.realTimeSearch === true
        }
        if (cap.includes('data') || cap.includes('analyt')) {
          return tool.capabilities?.dataAnalysis === true
        }
        if (cap.includes('document') || cap.includes('pdf')) {
          return tool.capabilities?.documentAnalysis === true
        }
        if (cap.includes('chat') || cap.includes('conversation')) {
          return tool.capabilities?.chat === true
        }
        return true
      })
    }
    
    // Filter by use case (search in description and purpose)
    // BUT only if we haven't already filtered by a specific capability
    const hasCapabilityFilter = needsCodeGen || needsImageGen || needsWebSearch || needsChat || needsDataAnalysis || needsDocAnalysis || needsTextGen
    if (useCase && !hasCapabilityFilter) {
      console.log('🔍 DEBUG - Filtering by use case:', useCase)
      const search = useCase.toLowerCase()
      recommendations = recommendations.filter(tool => {
        const inName = tool.name.toLowerCase().includes(search)
        const inPurpose = tool.primaryPurpose.toLowerCase().includes(search)
        const inDescription = tool.description?.toLowerCase().includes(search)
        const inBestUse = tool.bestUseCase?.toLowerCase().includes(search)
        const inTags = tool.tags.some(tag => tag.toLowerCase().includes(search))
        return inName || inPurpose || inDescription || inBestUse || inTags
      })
      console.log('🔍 DEBUG - Tools after use case filter:', recommendations.length)
    } else if (hasCapabilityFilter) {
      console.log('🔍 DEBUG - Skipping use case filter because capability filter was applied')
    }
    
    // Sort by relevance (prefer top30 and internal tools)
    recommendations.sort((a, b) => {
      const aScore = (a.tags?.includes('top30') ? 2 : 0) + (a.type === 'internal' ? 1 : 0)
      const bScore = (b.tags?.includes('top30') ? 2 : 0) + (b.type === 'internal' ? 1 : 0)
      return bScore - aScore
    })
    
    const top5 = recommendations.slice(0, 5)
    
    // Build context string for response
    const capabilityText = capability || 
      (needsCodeGen ? 'code generation' : '') ||
      (needsImageGen ? 'image generation' : '') ||
      (needsWebSearch ? 'web search' : '') ||
      (needsChat ? 'chat' : '') ||
      (needsDataAnalysis ? 'data analysis' : '') ||
      (needsDocAnalysis ? 'document analysis' : '') ||
      (needsTextGen ? 'text generation' : '')
    
    if (top5.length === 0) {
      const searchTerm = capabilityText || useCase || 'your request'
      return `I couldn't find tools matching "${searchTerm}". Try:\n\n• Browsing the tool catalog\n• Using different keywords\n• Asking about specific capabilities like "code generation" or "image creation"\n\nNeed help? Just ask! 😊`
    }
    
    const context = useCase ? `for ${useCase}` : capabilityText ? `with ${capabilityText}` : ''
    const typeContext = preferInternal ? ' (internal tools)' : preferExternal ? ' (external tools)' : ''
    
    let response = `🎯 **Recommended Tools ${context}${typeContext}:**\n\n`
    
    top5.forEach((tool, idx) => {
      const emoji = tool.type === 'internal' ? '🏢' : '🌐'
      const capabilities = []
      if (tool.capabilities?.codeGeneration) capabilities.push('Code')
      if (tool.imageGeneration || tool.capabilities?.imageGeneration) capabilities.push('Image')
      if (tool.realTimeWebSearch || tool.capabilities?.realTimeSearch) capabilities.push('Search')
      if (tool.capabilities?.dataAnalysis) capabilities.push('Data')
      if (tool.capabilities?.chat) capabilities.push('Chat')
      
      const capString = capabilities.length > 0 ? ` | ${capabilities.join(', ')}` : ''
      
      response += `${idx + 1}. ${emoji} **${tool.name}**${capString}\n   ${tool.primaryPurpose}\n\n`
    })
    
    if (recommendations.length > 5) {
      response += `\n*Found ${recommendations.length} tools total. Visit the catalog to explore more!*`
    }
    
    response += `\n\n💡 Want to compare these tools? Just ask me to compare them!`
    
    return response
  }
  
  private handleComparison(intent: Intent, message: string): string {
    const { toolNames } = intent.entities || {}
    
    console.log('🔍 DEBUG - Comparison handler called')
    console.log('🔍 DEBUG - Intent entities:', intent.entities)
    console.log('🔍 DEBUG - Tool names extracted:', toolNames)
    
    if (!toolNames || toolNames.length < 2) {
      // Get some example tools from the catalog
      const exampleTools = this.context.tools.slice(0, 4).map(t => t.name)
      const examples = exampleTools.length >= 2 
        ? `"Compare ${exampleTools[0]} and ${exampleTools[1]}"` 
        : `"Compare Tool1 and Tool2"`
      
      return `To compare tools, please specify at least 2 tool names.\n\nExample: ${examples}\n\n💡 You can also use the **Compare** feature in the tool catalog for detailed side-by-side analysis!`
    }
    
    console.log('🔍 DEBUG - Searching for tools:', toolNames)
    
    // Find the tools with fuzzy matching
    const foundTools = toolNames.map(name => this.findToolByName(name)).filter(Boolean) as Tool[]
    
    console.log('🔍 DEBUG - Found tools:', foundTools.map(t => t.name).join(', '))
    
    if (foundTools.length < 2) {
      // Try to suggest similar tools or show what's available
      const notFound = toolNames.filter(name => !this.findToolByName(name))
      
      // Get some popular tools as suggestions - try top30 first, then any tools
      let suggestions = this.context.tools
        .filter(t => t.tags?.includes('top30'))
        .slice(0, 8)
        .map(t => `${t.name} (${t.type})`)
      
      // If no top30 tools, just show first 8 tools
      if (suggestions.length === 0) {
        suggestions = this.context.tools
          .slice(0, 8)
          .map(t => `${t.name} (${t.type})`)
      }
      
      let response = `I couldn't find **${notFound.join(', ')}** in our catalog.\n\n`
      
      if (suggestions.length > 0) {
        response += `**Available tools you can compare:**\n`
        suggestions.forEach(name => response += `• ${name}\n`)
        response += `\n`
      }
      
      response += `💡 **Tips:**\n`
      response += `• Use the search bar to find exact tool names\n`
      response += `• Try "recommend tools for [your use case]" to discover tools\n`
      response += `• Browse the tool catalog to see all ${this.context.tools.length} available tools`
      
      return response
    }
    
    let response = `⚖️ **Tool Comparison:**\n\n`
    
    foundTools.forEach((tool, idx) => {
      const emoji = tool.type === 'internal' ? '🏢' : '🌐'
      response += `**${idx + 1}. ${emoji} ${tool.name}** (${tool.type})\n`
      response += `   **Purpose:** ${tool.primaryPurpose}\n`
      
      // Add sales description for comprehensive comparison
      if (tool.salesDescription) {
        response += `   **Overview:** ${tool.salesDescription}\n`
      }
      
      // Capabilities
      const caps = []
      if (tool.capabilities?.codeGeneration) caps.push('✅ Code Generation')
      if (tool.imageGeneration || tool.capabilities?.imageGeneration) caps.push('✅ Image Generation')
      if (tool.realTimeWebSearch || tool.capabilities?.realTimeSearch) caps.push('✅ Real-time Search')
      if (tool.capabilities?.dataAnalysis) caps.push('✅ Data Analysis')
      if (tool.capabilities?.documentAnalysis) caps.push('✅ Document Analysis')
      
      if (caps.length > 0) {
        response += `   **Capabilities:** ${caps.join(', ')}\n`
      }
      
      if (tool.access) {
        response += `   **Access:** ${tool.access}\n`
      }
      
      if (tool.cost) {
        response += `   **Cost:** ${tool.cost}\n`
      }
      
      if (tool.bestUseCase) {
        response += `   **Best For:** ${tool.bestUseCase}\n`
      }
      
      response += `\n`
    })
    
    response += `\n💡 **Pro Tip:** Use the **Compare** button in the tool catalog for a detailed side-by-side analysis with all features and capabilities!`
    
    return response
  }
  
  private handleAnalyticsQuery(intent: Intent, message: string): string {
    return this.analyticsService.processAnalyticsQuestion(message, intent.entities)
  }
  
  private handlePlatformHelp(intent: Intent, message: string): string {
    const lowerMsg = message.toLowerCase()
    const { feature, toolName } = intent.entities || {}
    
    // Handle "How do I access [tool]?" queries
    if (feature === 'tool_access' && toolName) {
      const tool = this.findToolByName(toolName)
      
      if (!tool) {
        return `I couldn't find "${toolName}" in our catalog. Try:\n\n• Checking the spelling\n• Using the search bar\n• Browsing the tool catalog\n\nNeed help finding something specific? Just ask! 🔍`
      }
      
      const emoji = tool.type === 'internal' ? '🏢' : '🌐'
      let response = `🔑 **How to Access ${tool.name}**\n\n`
      response += `${emoji} **Type:** ${tool.type.charAt(0).toUpperCase() + tool.type.slice(1)} Tool\n\n`
      
      // Access information
      if (tool.accessLink) {
        response += `📌 **Direct Access Link:**\n🔗 [${tool.name}](${tool.accessLink})\n\n`
      }
      
      if (tool.access) {
        response += `🔐 **Access Requirements:**\n${tool.access}\n\n`
      }
      
      // Documentation link
      if (tool.documentationLink) {
        response += `📚 **Documentation:**\n🔗 [View Documentation](${tool.documentationLink})\n\n`
      }
      
      // Training link
      if (tool.trainingLink) {
        response += `🎓 **Training Resources:**\n🔗 [Get Training](${tool.trainingLink})\n\n`
      }
      
      // Support link
      if (tool.supportLink) {
        response += `💬 **Support:**\n🔗 [Get Support](${tool.supportLink})\n\n`
      }
      
      // Quick info
      response += `**About ${tool.name}:**\n${tool.primaryPurpose}\n\n`
      
      if (!tool.accessLink && !tool.access) {
        response += `ℹ️ Access information for this tool is being updated. Please check the tool card in the catalog or contact support.\n\n`
      }
      
      response += `💡 Want to know more? Ask me "Tell me about ${tool.name}" or compare it with other tools!`
      
      return response
    }
    
    // Check if asking about AI Compass features specifically
    if ((lowerMsg.includes('compass') && (lowerMsg.includes('feature') || lowerMsg.includes('about ai compass'))) ||
        lowerMsg.includes('ai compass features')) {
      return getAICompassFeaturesResponse(message)
    }
    
    if (lowerMsg.includes('search') || lowerMsg.includes('find')) {
      return `🔍 **How to Search for Tools:**

1. **Search Bar** (top of catalog): Type keywords to instantly filter tools
2. **Category Filters**: Use dropdowns to filter by type (Internal/External), capabilities, tags
3. **Ask Me**: Just tell me what you need! e.g., "Find tools for data analysis"

**Search Tips:**
• Use specific keywords like "code", "image", "data"
• Filter by internal/external to narrow results
• Check tool tags for quick categorization

Try it now! 🚀`
    }
    
    if (lowerMsg.includes('compare')) {
      return `⚖️ **How to Compare Tools:**

**Method 1: Compare Button**
• Click the ⚖️ Compare button on any tool card
• Select up to 3 tools
• View detailed side-by-side comparison

**Method 2: Ask Me**
• "Compare ChatGPT and Gemini"
• "What's the difference between Copilot and Claude?"

**Comparison Features:**
✅ Capabilities breakdown
✅ Cost comparison
✅ Use case recommendations
✅ Access requirements

Give it a try! 🎯`
    }
    
    if (lowerMsg.includes('analytics') || lowerMsg.includes('dashboard')) {
      return `📊 **Analytics Dashboard:**

The Analytics page provides insights into our AI tool ecosystem:

**Key Metrics:**
• Total tools count (internal vs external)
• Capability distribution
• Technology breakdown
• Use case analysis

**Interactive Features:**
• Filter by category
• Visual charts and graphs
• Comparison matrix
• Export data

**Ask Me Analytics Questions:**
• "How many internal tools do we have?"
• "Show me tools with code generation"
• "What are the most popular tools?"

Visit the Analytics tab to explore! 📈`
    }
    
    if (lowerMsg.includes('suggest') || lowerMsg.includes('feedback')) {
      return `💡 **Suggestion Box:**

Help us improve AI-Compass!

**How to Submit:**
1. Click the 💡 icon in the bottom-right
2. Share your feedback, ideas, or requests
3. Submit directly to the team

**What to Suggest:**
• New tools to add
• Feature improvements
• Bug reports
• General feedback

Your input shapes the future of AI-Compass! 🚀`
    }
    
    if (lowerMsg.includes('language') || lowerMsg.includes('translate')) {
      return `🌍 **Multilingual Support:**

AI-Compass supports **8 languages**:
🇬🇧 English | 🇫🇷 French | 🇪🇸 Spanish | 🇩🇪 German
🇮🇹 Italian | 🇵🇹 Portuguese | 🇯🇵 Japanese | 🇨🇳 Chinese

**How to Switch Languages:**
• Use the language selector in the navigation
• Platform instantly translates all content
• I can chat in all supported languages!

Try asking me in different languages! 😊`
    }
    
    // General platform help
    return `🎯 **AI-Compass Platform Guide:**

**Main Features:**
🔍 **Tool Catalog** - Browse 62 AI tools
⚖️ **Compare** - Side-by-side tool comparison
📊 **Analytics** - Insights and statistics
💡 **Suggestion Box** - Share feedback
🌍 **8 Languages** - Full multilingual support

**What I Can Help With:**
• Find tools for your needs
• Compare tools
• Answer analytics questions
• Explain platform features
• Provide AI insights

**Popular Questions:**
• "Recommend a tool for [use case]"
• "How many internal tools are there?"
• "Compare [tool1] and [tool2]"

What would you like to know? 😊`
  }
  
  private handleToolDetails(intent: Intent, message: string): string {
    const { toolName } = intent.entities || {}
    
    if (!toolName) {
      return `Which tool would you like to know more about? You can:\n\n• Ask "Tell me about [tool name]"\n• Search in the catalog\n• Browse by category\n\nLet me know! 😊`
    }
    
    const tool = this.findToolByName(toolName)
    
    if (!tool) {
      return `I couldn't find "${toolName}" in our catalog. Try:\n\n• Checking the spelling\n• Using the search bar\n• Browsing the tool catalog\n\nNeed help finding something specific? Just ask! 🔍`
    }
    
    const emoji = tool.type === 'internal' ? '🏢' : '🌐'
    let response = `${emoji} **${tool.name}**\n\n`
    
    response += `**Type:** ${tool.type.charAt(0).toUpperCase() + tool.type.slice(1)}\n`
    response += `**Purpose:** ${tool.primaryPurpose}\n\n`
    
    // Add sales description for comprehensive information
    if (tool.salesDescription) {
      response += `**Overview:**\n${tool.salesDescription}\n\n`
    }
    
    if (tool.description) {
      response += `**Description:**\n${tool.description}\n\n`
    }
    
    // Capabilities section
    const capabilities = []
    if (tool.capabilities?.codeGeneration) capabilities.push('💻 Code Generation')
    if (tool.imageGeneration || tool.capabilities?.imageGeneration) capabilities.push('🎨 Image Generation')
    if (tool.realTimeWebSearch || tool.capabilities?.realTimeSearch) capabilities.push('🌐 Real-time Web Search')
    if (tool.capabilities?.dataAnalysis) capabilities.push('📊 Data Analysis')
    if (tool.capabilities?.documentAnalysis) capabilities.push('📄 Document Analysis')
    if (tool.capabilities?.chat) capabilities.push('💬 Chat Interface')
    if (tool.capabilities?.vision) capabilities.push('👁️ Vision/Image Understanding')
    
    if (capabilities.length > 0) {
      response += `**Key Capabilities:**\n${capabilities.join('\n')}\n\n`
    }
    
    // Additional info
    if (tool.access) {
      response += `**Access:** ${tool.access}\n`
    }
    if (tool.cost) {
      response += `**Cost:** ${tool.cost}\n`
    }
    if (tool.bestUseCase) {
      response += `**Best Use Case:** ${tool.bestUseCase}\n`
    }
    if (tool.technology) {
      response += `**Technology:** ${tool.technology}\n`
    }
    
    // Links
    const links = []
    if (tool.accessLink) links.push(`[Access](${tool.accessLink})`)
    if (tool.documentationLink) links.push(`[Documentation](${tool.documentationLink})`)
    if (tool.trainingLink) links.push(`[Training](${tool.trainingLink})`)
    if (tool.supportLink) links.push(`[Support](${tool.supportLink})`)
    
    if (links.length > 0) {
      response += `\n**Quick Links:** ${links.join(' | ')}\n`
    }
    
    response += `\n💡 Want to compare ${tool.name} with other tools? Just ask!`
    
    return response
  }
  
  private handleGreeting(message: string): string {
    const greetings = [
      `👋 Hello! I'm SONA, your AI assistant for AI-Compass.\n\nI can help you:\n• Find the perfect AI tool for your needs\n• Compare different tools\n• Answer analytics questions\n• Explain platform features\n\nWhat can I help you with today?`,
      
      `Hi there! 😊 Welcome to AI-Compass!\n\nI'm here to help you discover and compare **43+ AI tools**.\n\nTry asking:\n• "Recommend a tool for data analysis"\n• "How many internal tools are there?"\n• "Compare ChatGPT and Gemini"\n\nWhat interests you?`,
      
      `Hey! 🚀 Ready to explore AI tools?\n\nI can:\n✅ Recommend tools for your specific needs\n✅ Compare tools side-by-side\n✅ Provide analytics insights\n✅ Help you navigate the platform\n\nJust ask me anything!`
    ]
    
    return greetings[Math.floor(Math.random() * greetings.length)]
  }
  
  private handleSuggestion(message: string): string {
    return `💡 **Thank you for your feedback!**\n\nYour suggestion is valuable! To submit it officially:\n\n1. Click the 💡 icon in the bottom-right corner\n2. Enter your detailed suggestion\n3. Submit directly to the AI-Compass team\n\nYour input helps us improve! 🚀\n\nIs there anything else I can help you with?`
  }
  
  private handleGeneralQuestion(message: string): string {
    const lowerMsg = message.toLowerCase()
    
    // Identity / "Who are you" questions
    if (/who\s+(are|is)\s+(you|sona)|what\s+(are|is)\s+(you|sona)|tell me about (yourself|sona)|introduce (yourself|sona)|what('?s| is) your name|your name/i.test(lowerMsg)) {
      return `I am **SONA** (Sanofi Organizational Navigation Assistant) 🤖\n\nI'm an intelligent AI agent created by Sonnil Q. Le to help Sanofi employees navigate the AI Compass platform and discover the right AI tools for their work.\n\n**What I can do:**\n\n**1️⃣ AI Tool Discovery & Guidance** 🔍\n• Smart tool recommendations from 52+ tools based on your needs\n• Detailed side-by-side tool comparisons\n• Knowledge of Sanofi's AI ecosystem and platform features\n• Help you find the perfect tool for any task\n\n**2️⃣ Platform Features Assistance** 🎯\n• Guide you through search, filters, and analytics\n• Answer questions about AI Compass features\n• Help you understand tool capabilities\n• Support in 8 languages\n\n**3️⃣ Conversational AI** 💬\n• Natural language understanding\n• Context-aware responses\n• Learning from interactions\n• Friendly and helpful personality\n\nHow can I help you today?`
    }
    
    // Creator / "Who built you" questions
    if (/who\s+(built|made|created|developed)\s+(you|sona)|who\s+is\s+your\s+(creator|maker|builder)|who\s+built\s+sona|built\s+by\s+who/i.test(lowerMsg)) {
      return `I was built by **Sonnil Q. Le** and the **AI-Compass** team at Sanofi. 🚀\n\n📧 Contact: sonnil.le@sanofi.com\n\nThe AI-Compass platform helps Sanofians discover and leverage AI tools to accelerate innovation!`
    }
    
    // Sonnil Q. Le questions - import getSonnilLeResponse from knowledge.ts
    if (/sonnil\b|who\s+is\s+sonnil|tell\s+me\s+about\s+sonnil/i.test(lowerMsg)) {
      // Import and use the comprehensive Sonnil profile from knowledge.ts
      const { getSonnilLeResponse } = require('../knowledge')
      return getSonnilLeResponse(message)
    }
    
    // Jokes
    if (lowerMsg.includes('joke') || lowerMsg.includes('funny') || lowerMsg.includes('humor') || lowerMsg.includes('laugh')) {
      const jokes = [
        "Why did the neural network go to therapy? It had too many layers of emotional baggage! 🧠😄",
        "What do you call an AI that sings? A-dell! 🎵🤖",
        "Why did the machine learning model break up with its dataset? There were too many outliers in the relationship! 💔📊",
        "How does an AI flirt? 'Hey baby, are you a training dataset? Because I want to learn from you!' 😉🤖",
        "Why don't AIs ever get lost? They always follow their neural pathways! 🗺️🧠",
        "What's an AI's favorite type of music? Algorithm and blues! 🎵🎸",
        "Why did the chatbot go to school? To improve its class-ification! 🎓🤖"
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    }
    
    // Facts
    if (lowerMsg.includes('fact') || lowerMsg.includes('trivia') || lowerMsg.includes('did you know')) {
      const facts = [
        "🤖 **AI Fun Fact:** The term 'Artificial Intelligence' was coined in 1956 at the Dartmouth Conference. The field is almost 70 years old!",
        "📊 **Data Insight:** Every day, we create 2.5 quintillion bytes of data! That's why AI tools are so crucial for making sense of it all.",
        "🎯 **AI Milestone:** GPT-3 has 175 billion parameters - that's roughly equivalent to 800GB of text data!",
        "🧠 **Amazing AI Fact:** Deep Blue, IBM's chess computer, defeated world champion Garry Kasparov in 1997 - a historic moment for AI!",
        "🌟 **GenAI Impact:** Generative AI models can now create images, write code, compose music, and even design proteins for drug discovery!",
        "💡 **Sanofi Innovation:** AI-Compass brings together 52+ AI tools to accelerate innovation across R&D, manufacturing, and commercial operations!",
        "🚀 **Future Ready:** By 2025, it's estimated that 75% of enterprise applications will use AI in some form!"
      ]
      return facts[Math.floor(Math.random() * facts.length)]
    }
    
    // AI-related questions
    if (lowerMsg.includes('what is ai') || lowerMsg.includes('what\'s ai')) {
      return `🤖 **Artificial Intelligence (AI)** is technology that enables machines to simulate human intelligence.\n\n**Key AI Capabilities:**\n• Learning from data\n• Understanding language\n• Recognizing patterns\n• Making decisions\n• Generating content\n\n**At Sanofi:**\nWe use AI to accelerate drug discovery, improve patient outcomes, and enhance operational efficiency.\n\n**Explore AI Tools:**\nAI-Compass features 43+ tools for various AI tasks. Ask me to recommend one! 🚀`
    }
    
    if (lowerMsg.includes('machine learning') || lowerMsg.includes('ml')) {
      return `🧠 **Machine Learning (ML)** is a subset of AI where systems learn from data without explicit programming.\n\n**Types:**\n• Supervised Learning (labeled data)\n• Unsupervised Learning (pattern discovery)\n• Reinforcement Learning (learning from actions)\n\n**ML in Our Tools:**\nMany tools in AI-Compass use ML for:\n• Predictive analytics\n• Natural language processing\n• Image recognition\n\nWant to find ML tools? Just ask! 📊`
    }
    
    if (lowerMsg.includes('sanofi') || lowerMsg.includes('company')) {
      // Check if there's a tool named "Sanofi"
      const sanofiTool = this.context.tools.find(tool => 
        tool.name.toLowerCase().includes('sanofi')
      )
      
      // If no Sanofi tool exists, provide news/general information
      if (!sanofiTool) {
        return `🏢 **About Sanofi:**\n\n**Company Overview:**\nSanofi is a global healthcare leader focused on patient needs, developing innovative solutions across vaccines, rare diseases, and general medicines.\n\n**AI & Digital Transformation:**\nSanofi leverages AI to transform healthcare through:\n\n**Research & Development:**\n• Drug discovery acceleration\n• Clinical trial optimization\n• Personalized medicine\n\n**Operations:**\n• Process automation\n• Predictive maintenance\n• Supply chain optimization\n\n**Our AI Ecosystem:**\nAI-Compass showcases our commitment to democratizing AI across the organization with 52+ tools for various needs.\n\n**Recent Developments:**\n• Expanding AI capabilities in drug discovery\n• Implementing AI-driven patient care solutions\n• Building robust AI governance frameworks\n\nExplore our tools to join the AI transformation! 🚀`
      }
      
      // If Sanofi tool exists, provide tool-specific information
      return `🏢 **AI at Sanofi:**\n\nSanofi leverages AI to transform healthcare through:\n\n**Research & Development:**\n• Drug discovery acceleration\n• Clinical trial optimization\n• Personalized medicine\n\n**Operations:**\n• Process automation\n• Predictive maintenance\n• Supply chain optimization\n\n**Our AI Strategy:**\nAI-Compass showcases our commitment to democratizing AI across the organization with 52+ tools for various needs.\n\nExplore our tools to join the AI transformation! 🚀`
    }
    
    // Fallback
    return `I'm here to help you with AI-Compass! 😊\n\n**I can assist with:**\n• Finding AI tools for your needs\n• Comparing tools\n• Analytics questions\n• Platform navigation\n• AI insights and tips\n\n**Try asking:**\n• "Recommend a tool for [your need]"\n• "Compare [tool1] and [tool2]"\n• "How many tools support code generation?"\n\nWhat would you like to know?`
  }
}
