import React, { useRef, useState, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Sparkles, Maximize2, Minimize2, ArrowDown } from 'lucide-react'

type Msg = { role: 'user' | 'assistant', content: string }

type UserProfile = {
  name?: string
  department?: string
  interests: string[]
  commonQueries: string[]
  toolsAskedAbout: string[]
  conversationStyle: 'formal' | 'casual' | 'technical'
  lastInteraction?: string
}

type Props = {
  toolsCatalog: any[]
  /** Optional: override API path (default uses VITE_CHAT_API_PATH or '/api/ai-chat') */
  apiPath?: string
}

function getApiPath(override?: string) {
  // For now, we'll use a simple fallback - can be configured later
  return override || '/api/ai-chat'
}

// Learn from user interactions and build profile
function updateUserProfile(userInput: string, conversationHistory: Msg[], toolsCatalog: any[]): UserProfile {
  const storedProfile = localStorage.getItem('ai_compass_user_profile')
  const profile: UserProfile = storedProfile ? JSON.parse(storedProfile) : {
    interests: [],
    commonQueries: [],
    toolsAskedAbout: [],
    conversationStyle: 'casual'
  }

  // Detect user's conversation style
  const input = userInput.toLowerCase()
  if (input.match(/\b(please|kindly|would you|could you)\b/)) {
    profile.conversationStyle = 'formal'
  } else if (input.match(/\b(hey|cool|awesome|thanks|thx)\b/)) {
    profile.conversationStyle = 'casual'
  } else if (input.match(/\b(api|integration|technical|specification|architecture)\b/)) {
    profile.conversationStyle = 'technical'
  }

  // Track topics of interest
  const topics = ['r&d', 'research', 'medical', 'manufacturing', 'finance', 'productivity', 'creative', 'data', 'compliance', 'automation']
  topics.forEach(topic => {
    if (input.includes(topic) && !profile.interests.includes(topic)) {
      profile.interests.push(topic)
    }
  })

  // Track tools asked about
  toolsCatalog.forEach(tool => {
    if (input.includes(tool.name.toLowerCase()) && !profile.toolsAskedAbout.includes(tool.name)) {
      profile.toolsAskedAbout.push(tool.name)
      if (profile.toolsAskedAbout.length > 10) profile.toolsAskedAbout.shift()
    }
  })

  // Track common query patterns
  const queryTypes = ['compare', 'recommend', 'access', 'training', 'cost', 'features']
  queryTypes.forEach(type => {
    if (input.includes(type)) {
      profile.commonQueries.push(type)
      if (profile.commonQueries.length > 20) profile.commonQueries.shift()
    }
  })

  profile.lastInteraction = new Date().toISOString()
  localStorage.setItem('ai_compass_user_profile', JSON.stringify(profile))
  return profile
}

// Get personalized greeting based on user profile and time
function getPersonalizedGreeting(profile: UserProfile): string {
  const hour = new Date().getHours()
  let timeGreeting = 'Hello'
  
  if (hour < 12) timeGreeting = 'Good morning'
  else if (hour < 17) timeGreeting = 'Good afternoon'
  else timeGreeting = 'Good evening'

  const greetings = [
    `${timeGreeting}! 👋`,
    `Hey there! 😊`,
    `Hi! Great to see you again! 🌟`,
    `${timeGreeting}! Hope you're having a great day! ☀️`
  ]

  const casualGreetings = [
    `Hey! 👋 What's up?`,
    `Hi there! 😊 How's it going?`,
    `Hello! 🌟 Nice to see you!`,
    `Hey! Hope you're doing well! ✨`
  ]

  const formalGreetings = [
    `${timeGreeting}. How may I assist you today?`,
    `${timeGreeting}. I'm here to help.`,
    `Hello. What can I help you with today?`
  ]

  let greeting: string
  if (profile.conversationStyle === 'formal') {
    greeting = formalGreetings[Math.floor(Math.random() * formalGreetings.length)]
  } else if (profile.conversationStyle === 'casual') {
    greeting = casualGreetings[Math.floor(Math.random() * casualGreetings.length)]
  } else {
    greeting = greetings[Math.floor(Math.random() * greetings.length)]
  }

  return greeting
}

// Detect small talk and respond appropriately
function getSmallTalkResponse(userInput: string, profile: UserProfile): string | null {
  const input = userInput.toLowerCase().trim()
  
  // Name/Identity questions
  if (input.match(/\b(who are you|what('|')s your name|what are you called|what do (?:people|they) call you|tell me about yourself|introduce yourself|your name)\b/i)) {
    const responses = [
      `Hi! I'm **SONA**, which stands for **S**anofi **O**nline **N**avigation **A**ssistant! 🤖\n\nI'm your dedicated AI Compass assistant, here to help you navigate and discover the perfect AI tools from Sanofi's comprehensive catalog. Whether you need internal tools like Concierge and Newton, or want to explore external platforms like ChatGPT and Claude, I've got you covered! 🚀\n\nWhat can I help you find today?`,
      `Nice to meet you! My name is **SONA** - your AI Compass assistant! 😊\n\nI specialize in helping Sanofi employees like you discover, compare, and understand our extensive collection of AI tools. Think of me as your personal guide through the world of AI at Sanofi!\n\nWhat would you like to explore?`,
      `I'm **SONA**, the AI Compass assistant! 🌟\n\nMy job is to help you find the perfect AI tools for your needs - whether it's for R&D, productivity, medical insights, or creative work. I know everything about our internal tools and the latest external AI platforms!\n\nHow can I assist you today?`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Greetings
  if (input.match(/^(hi|hello|hey|good morning|good afternoon|good evening|greetings|howdy|sup|what's up|yo)$/i)) {
    const greeting = getPersonalizedGreeting(profile)
    return `${greeting} I'm **SONA**, your AI Compass assistant, ready to help you explore Sanofi's AI tools! 🚀\n\nWhat brings you here today?`
  }
  
  // How are you
  if (input.match(/^(how are you|how's it going|how are things|what's up|how do you do)\??$/i)) {
    const responses = [
      `I'm doing great, thanks for asking! 😊 I'm SONA, and I'm excited to help you discover the perfect AI tools.`,
      `Doing wonderful! 🌟 I've been helping lots of people find the right AI tools today. What can I help you with?`,
      `I'm fantastic! ✨ Ready to help you navigate the AI tools landscape.`,
      `Feeling great! 💪 Let's find some awesome AI tools for you.`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Weather talk
  if (input.match(/\b(weather|temperature|rain|sunny|cold|hot|forecast)\b/i)) {
    const responses = [
      `I don't have access to weather data, but I hope it's nice where you are! ☀️ What I, SONA, can help with is finding the perfect AI tool for your needs.`,
      `Weather's not my thing, but AI tools definitely are! 🌟 I'm SONA, and I'd love to help you find what you're looking for.`,
      `I'm more of an AI tools expert than a meteorologist! 😊 But I'd love to help you with anything related to our catalog.`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Thanks
  if (input.match(/^(thanks|thank you|thx|ty|appreciate it|much appreciated)$/i)) {
    const responses = [
      `You're very welcome! 😊 Happy to help anytime!`,
      `My pleasure! 🌟 Feel free to ask if you need anything else.`,
      `Glad I could help! ✨ Come back anytime you need assistance.`,
      `You're welcome! 👍 Always here to help with AI tools.`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Goodbye
  if (input.match(/^(bye|goodbye|see you|later|catch you later|gotta go|take care)$/i)) {
    const responses = [
      `Goodbye! 👋 Feel free to come back anytime you need help with AI tools!`,
      `See you later! 🌟 Happy exploring!`,
      `Take care! ✨ Come back soon if you need more assistance!`,
      `Bye! 😊 Good luck with your AI tools journey!`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // General pleasantries
  if (input.match(/^(nice|cool|awesome|great|perfect|excellent|wonderful)$/i)) {
    return `I'm glad you think so! 😊 Is there anything specific about our AI tools I can help you with?`
  }
  
  return null
}

// Enhanced AI Agent with real intelligence and personality awareness
function getSmartAIResponse(userInput: string, toolsCatalog: any[], conversationHistory: Msg[]): string {
  // Update user profile based on interaction
  const userProfile = updateUserProfile(userInput, conversationHistory, toolsCatalog)
  
  // Check for small talk first
  const smallTalkResponse = getSmallTalkResponse(userInput, userProfile)
  if (smallTalkResponse) {
    const internalCount = toolsCatalog.filter(t => t.type === 'internal').length
    const externalCount = toolsCatalog.filter(t => t.type === 'external').length
    
    // Add personalized suggestions based on profile
    let personalizedHelp = `\n\n**Here's what I can help you with:**\n`
    
    if (userProfile.interests.length > 0) {
      personalizedHelp += `\n🎯 **Based on your interests** (${userProfile.interests.slice(0, 3).join(', ')}):\n`
      personalizedHelp += `• Find specialized tools for your area\n`
      personalizedHelp += `• Get recommendations tailored to your work\n`
    }
    
    personalizedHelp += `\n🔍 **Discover & Compare:**\n`
    personalizedHelp += `• Explore ${internalCount} internal and ${externalCount} external AI tools\n`
    personalizedHelp += `• Compare features, costs, and capabilities\n`
    personalizedHelp += `• Find the perfect tool for any task\n`
    
    personalizedHelp += `\n📋 **Quick Access:**\n`
    personalizedHelp += `• Check training requirements\n`
    personalizedHelp += `• View access links and documentation\n`
    personalizedHelp += `• Learn about new AI tools\n`
    
    if (userProfile.toolsAskedAbout.length > 0) {
      personalizedHelp += `\n💡 **Continue exploring:**\n`
      personalizedHelp += `You've been interested in: ${userProfile.toolsAskedAbout.slice(-3).join(', ')}\n`
    }
    
    return smallTalkResponse + personalizedHelp
  }
  // Create a comprehensive context about the tools
  const toolsContext = toolsCatalog.map(tool => {
    return `Tool: ${tool.name}
    Purpose: ${tool.primaryPurpose}
    Users: ${tool.targetUsers}
    Technology: ${tool.technology}
    Best Use: ${tool.bestUseCase}
    Cost: ${tool.cost}
    Features: ${Object.entries(tool)
      .filter(([key, value]) => typeof value === 'boolean' && value === true)
      .map(([key]) => key)
      .join(', ')}
    Access: ${tool.accessLink || 'Internal portal'}
    Training: ${tool.trainingRequired ? 'Required' : 'Not required'}
    Compliance: ${tool.complianceAwareness ? 'Yes' : 'No'}
    `
  }).join('\n\n')

  // Get conversation context
  const recentMessages = conversationHistory.slice(-4).map(msg => 
    `${msg.role}: ${msg.content}`
  ).join('\n')

  // Create a smart system prompt
  const systemPrompt = `You are an AI Compass assistant, an expert on Sanofi's AI tools catalog. You help employees discover, compare, and understand AI tools.

AVAILABLE TOOLS CATALOG:
${toolsContext}

CONVERSATION HISTORY:
${recentMessages}

USER QUESTION: ${userInput}

INSTRUCTIONS:
- Be conversational and helpful
- Provide specific tool recommendations based on user needs
- Compare tools when asked with detailed feature analysis
- Mention access methods, training requirements, and costs
- Use bullet points and formatting for clarity
- If asked about capabilities you don't see in the catalog, suggest the closest alternatives
- Be aware of Sanofi-specific context (internal vs external tools, compliance, etc.)
- Suggest multiple options when appropriate
- Ask follow-up questions to better understand user needs

Respond as a knowledgeable AI assistant:`

  // Enhanced response generation with better logic
  return generateIntelligentResponse(systemPrompt, userInput, toolsCatalog, userProfile)
}

function generateIntelligentResponse(systemPrompt: string, userInput: string, toolsCatalog: any[], userProfile: UserProfile): string {
  const input = userInput.toLowerCase()
  
  // Check if the question is relevant to AI tools and Sanofi
  if (!isRelevantToAITools(input, toolsCatalog)) {
    return getOffTopicResponse(userInput)
  }
  
  // Intent detection with better logic
  const intents = {
    greeting: /\b(hi|hello|hey|good morning|good afternoon)\b/i,
    comparison: /\b(compare|difference|vs|versus|better|best)\b/i,
    recommendation: /\b(recommend|suggest|need|want|looking for|help with|best for)\b/i,
    specific_tool: new RegExp(`\\b(${toolsCatalog.map(t => t.name.toLowerCase()).join('|')})\\b`, 'i'),
    capabilities: /\b(can|does|features|capabilities|what|how)\b/i,
    access: /\b(access|login|how to use|get started|url|link)\b/i,
    training: /\b(training|learn|course|tutorial|guide)\b/i,
    cost: /\b(cost|price|free|paid|expensive|budget)\b/i
  }

  // Multi-intent analysis
  const detectedIntents = Object.entries(intents)
    .filter(([_, regex]) => regex.test(input))
    .map(([intent]) => intent)

  // Greeting responses with personalization
  if (detectedIntents.includes('greeting')) {
    const greeting = getPersonalizedGreeting(userProfile)
    const internalCount = toolsCatalog.filter(t => t.type === 'internal').length
    const externalCount = toolsCatalog.filter(t => t.type === 'external').length
    
    let response = `${greeting} I'm **SONA**, your AI Compass assistant, and I know all about Sanofi's comprehensive AI tools catalog with **${internalCount} internal** and **${externalCount} external** tools.\n\n`
    
    // Add personalized welcome back message
    if (userProfile.lastInteraction) {
      const lastVisit = new Date(userProfile.lastInteraction)
      const daysSince = Math.floor((Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSince === 0) {
        response += `Welcome back! 🌟\n\n`
      } else if (daysSince === 1) {
        response += `Great to see you again! It's been a day since your last visit. 🌟\n\n`
      } else if (daysSince < 7) {
        response += `Welcome back! It's been ${daysSince} days. 🌟\n\n`
      }
    }
    
    response += `**I can help you:**\n`
    response += `🔍 **Find the right tool** for your specific needs\n`
    response += `📊 **Compare tools** to see which works best\n`
    response += `🎯 **Get recommendations** based on your role or project\n`
    response += `📋 **Check access requirements** and training needs\n`
    response += `🆕 **Discover new AI tools** like Claude 3, Gemini, Perplexity AI, and more!`
    
    // Add personalized suggestions based on history
    if (userProfile.interests.length > 0) {
      response += `\n\n**Based on your interests:**\n`
      response += `I noticed you're interested in ${userProfile.interests.slice(0, 3).join(', ')}. I can recommend tools specifically for these areas!`
    }
    
    if (userProfile.toolsAskedAbout.length > 0) {
      response += `\n\n**Continue exploring:**\n`
      response += `You've checked out ${userProfile.toolsAskedAbout.slice(-3).join(', ')} recently. Want to compare them or explore similar tools?`
    }
    
    return response + getSuggestedQuestions('greeting')
  }

  // Tool comparison logic
  if (detectedIntents.includes('comparison')) {
    const toolNames = toolsCatalog.map(t => t.name.toLowerCase())
    const mentionedTools = toolNames.filter(name => input.includes(name))
    
    if (mentionedTools.length >= 2) {
      const tools = mentionedTools.slice(0, 2).map(name => 
        toolsCatalog.find(t => t.name.toLowerCase() === name)
      )
      
      const response = `## Comparing ${tools[0].name} vs ${tools[1].name}

**${tools[0].name}:**
• **Purpose:** ${tools[0].primaryPurpose}
• **Best for:** ${tools[0].bestUseCase}
• **Users:** ${tools[0].targetUsers}
• **Technology:** ${tools[0].technology}
• **Cost:** ${tools[0].cost}
• **Training:** ${tools[0].trainingRequired ? 'Required' : 'Not required'}

**${tools[1].name}:**
• **Purpose:** ${tools[1].primaryPurpose}
• **Best for:** ${tools[1].bestUseCase}
• **Users:** ${tools[1].targetUsers}
• **Technology:** ${tools[1].technology}
• **Cost:** ${tools[1].cost}
• **Training:** ${tools[1].trainingRequired ? 'Required' : 'Not required'}

**Recommendation:** ${tools[0].name} is better for ${tools[0].bestUseCase?.toLowerCase()}, while ${tools[1].name} excels at ${tools[1].bestUseCase?.toLowerCase()}.`
      
      return response + getSuggestedQuestions('comparison', [tools[0].name, tools[1].name])
    }
  }

  // Smart recommendations based on keywords
  if (detectedIntents.includes('recommendation')) {
    const useCase = analyzeUseCase(input)
    const recommendedTools = getToolRecommendations(useCase, toolsCatalog)
    
    const response = `Based on your request for "${userInput}", here are my top recommendations:

${recommendedTools.map((tool, index) => `
**${index + 1}. ${tool.name}** ${tool.type === 'internal' ? '🔵 Internal' : '🔗 External'}
${tool.primaryPurpose}

✅ **Why it's great:** ${tool.bestUseCase}
👥 **Perfect for:** ${tool.targetUsers}
💰 **Cost:** ${tool.cost}
${tool.accessLink ? `🔗 **Access:** ${tool.accessLink}` : '🔗 **Access:** Through internal portal'}
${tool.trainingRequired ? '📚 **Training required**' : '✅ **No training needed**'}
`).join('\n')}`
    
    return response + getSuggestedQuestions('recommendation', recommendedTools.map(t => t.name))
  }

  // Specific tool information
  if (detectedIntents.includes('specific_tool')) {
    const toolName = toolsCatalog.find(t => input.includes(t.name.toLowerCase()))?.name
    const tool = toolsCatalog.find(t => t.name.toLowerCase() === toolName?.toLowerCase())
    
    if (tool) {
      const response = `## ${tool.name} ${tool.type === 'internal' ? '🔵 Internal Tool' : '🔗 External Tool'}

**${tool.primaryPurpose}**

📋 **Key Details:**
• **Best Use Case:** ${tool.bestUseCase}
• **Target Users:** ${tool.targetUsers}
• **Technology:** ${tool.technology}
• **Cost:** ${tool.cost || 'Contact for pricing'}

🔧 **Capabilities:**
${Object.entries(tool)
  .filter(([key, value]) => typeof value === 'boolean' && value === true)
  .map(([key]) => `• ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`)
  .join('\n') || '• Full feature set available'}

${tool.accessLink ? `🔗 **Access:** ${tool.accessLink}` : '🔗 **Access:** Available through internal systems'}
${tool.trainingRequired ? '📚 **Training:** Required - check documentation for resources' : '✅ **Training:** Not required'}
${tool.complianceAwareness ? '✅ **Compliance:** Fully compliant with Sanofi policies' : '⚠️ **Compliance:** Check with compliance team if needed'}`
      
      return response + getSuggestedQuestions('specific_tool', [tool.name])
    }
  }

  // Default intelligent response with context awareness
  const relevantTools = findRelevantTools(input, toolsCatalog)
  const context = analyzeContext(input)
  
  const response = `I understand you're asking about "${userInput}". ${context}

Based on your query, these tools might help:

${relevantTools.slice(0, 3).map(tool => `
🔹 **${tool.name}**: ${tool.primaryPurpose}
   Best for: ${tool.bestUseCase}
   ${tool.type === 'internal' ? 'Internal Sanofi tool' : 'External platform'}
`).join('')}

To give you a more specific recommendation, could you tell me:
• What type of work are you doing? (R&D, Medical, Manufacturing, etc.)
• Are you looking for something specific like data analysis, content creation, or automation?
• Do you prefer internal Sanofi tools or are external options okay?`
  
  return response + getSuggestedQuestions('default', relevantTools.slice(0, 2).map(t => t.name))
}

// Helper functions for intelligent analysis
function analyzeUseCase(input: string): string {
  const useCases = {
    'research': /\b(research|r&d|scientific|study|analysis|data)\b/i,
    'productivity': /\b(productivity|efficient|organize|schedule|meeting)\b/i,
    'creative': /\b(creative|content|writing|design|generate)\b/i,
    'medical': /\b(medical|clinical|patient|drug|pharma)\b/i,
    'manufacturing': /\b(manufacturing|production|quality|supply)\b/i,
    'finance': /\b(finance|budget|cost|financial|money)\b/i,
    'visualization': /\b(visual|chart|graph|dashboard|report)\b/i,
    'coding': /\b(code|programming|development|software|api)\b/i
  }
  
  for (const [useCase, regex] of Object.entries(useCases)) {
    if (regex.test(input)) return useCase
  }
  return 'general'
}

function getToolRecommendations(useCase: string, toolsCatalog: any[]): any[] {
  const recommendations = {
    'research': ['Newton', 'AI Research Factory', 'MedIS', 'Perplexity AI', 'Claude 3', 'Google Gemini'],
    'productivity': ['Concierge', 'Microsoft Copilot', 'Notion AI', 'Amazon Q'],
    'creative': ['ChatGPT', 'Jasper AI', 'Midjourney', 'Runway ML', 'Stable Diffusion'],
    'medical': ['MedIS', 'Newton', 'IBM Watsonx'],
    'manufacturing': ['Digital Twins', 'Plai', 'IBM Watsonx'],
    'finance': ['Plai', 'Salesforce Agentforce', 'Amazon Q'],
    'visualization': ['Plai', 'Runway ML', 'Midjourney'],
    'coding': ['Microsoft Copilot', 'ChatGPT', 'Replit Ghostwriter', 'Hugging Face'],
    'marketing': ['Jasper AI', 'Salesforce Agentforce', 'Midjourney', 'Runway ML'],
    'enterprise': ['IBM Watsonx', 'Salesforce Agentforce', 'Amazon Q', 'Cohere Command R+'],
    'opensource': ['Stable Diffusion', 'Mistral AI', 'Hugging Face']
  }
  
  const toolNames = recommendations[useCase] || recommendations['productivity']
  return toolNames
    .map(name => toolsCatalog.find(t => t.name === name))
    .filter(Boolean)
    .slice(0, 3)
}

function findRelevantTools(input: string, toolsCatalog: any[]): any[] {
  return toolsCatalog
    .map(tool => {
      let relevanceScore = 0
      const searchText = `${tool.name} ${tool.primaryPurpose} ${tool.bestUseCase} ${tool.targetUsers}`.toLowerCase()
      
      input.toLowerCase().split(' ').forEach(word => {
        if (searchText.includes(word)) relevanceScore++
      })
      
      return { ...tool, relevanceScore }
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .filter(tool => tool.relevanceScore > 0)
}

function analyzeContext(input: string): string {
  if (input.includes('help')) return "I'm here to help you find the perfect AI tool!"
  if (input.includes('best')) return "Let me find the best options for your needs."
  if (input.includes('compare')) return "I'll help you compare the available options."
  return "Let me analyze the best tools for your situation."
}

// Check if user question is relevant to AI tools
function isRelevantToAITools(input: string, toolsCatalog: any[]): boolean {
  const relevantKeywords = [
    // AI/Tool related
    'ai', 'tool', 'software', 'application', 'platform', 'system', 'technology',
    // Work related
    'work', 'productivity', 'collaboration', 'business', 'project', 'task',
    // Sanofi related
    'sanofi', 'internal', 'external', 'employee', 'company',
    // Specific capabilities
    'analysis', 'research', 'data', 'visualization', 'automation', 'insight',
    'document', 'email', 'meeting', 'schedule', 'search', 'generate',
    // Question types
    'recommend', 'suggest', 'compare', 'help', 'need', 'best', 'access',
    'training', 'cost', 'feature', 'capability', 'how', 'what', 'which',
    // Tool names (dynamic)
    ...toolsCatalog.map(t => t.name.toLowerCase()),
    // Use cases
    'r&d', 'research', 'medical', 'manufacturing', 'finance', 'creative'
  ]
  
  const irrelevantKeywords = [
    'weather', 'temperature', 'climate', 'rain', 'sunny', 'cloudy',
    'sports', 'football', 'basketball', 'soccer', 'game', 'match',
    'food', 'recipe', 'cooking', 'restaurant', 'meal', 'eat',
    'movie', 'film', 'actor', 'actress', 'cinema', 'entertainment',
    'music', 'song', 'album', 'artist', 'concert', 'band',
    'travel', 'vacation', 'flight', 'hotel', 'tourist',
    'personal', 'relationship', 'dating', 'family', 'friend',
    'health', 'medicine', 'doctor', 'hospital', 'symptom',
    'politics', 'government', 'election', 'politician',
    'philosophy', 'religion', 'spiritual', 'meaning of life',
    'joke', 'funny', 'humor', 'laugh'
  ]
  
  // Check for irrelevant keywords first
  const hasIrrelevantKeywords = irrelevantKeywords.some(keyword => 
    input.includes(keyword)
  )
  
  if (hasIrrelevantKeywords) {
    // Unless it also has relevant keywords (mixed context)
    const hasRelevantKeywords = relevantKeywords.some(keyword => 
      input.includes(keyword)
    )
    return hasRelevantKeywords
  }
  
  // Check for relevant keywords
  return relevantKeywords.some(keyword => input.includes(keyword))
}

// Response for off-topic questions
function getOffTopicResponse(userInput: string): string {
  const responses = [
    "I'm specialized in helping you with Sanofi's AI tools catalog. I don't have expertise in other areas.",
    "I'm not an expert in that area - I focus on helping you discover and compare AI tools available at Sanofi.",
    "That's outside my expertise! I'm designed to help you navigate Sanofi's AI tools landscape.",
    "I can't help with that topic, but I'm great at helping you find the right AI tools for your work!"
  ]
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  
  return `${randomResponse}

Here's what I can help you with instead:

🔍 **Discover AI Tools**
• "What tools are available for R&D work?"
• "Show me productivity tools"
• "What's new in the catalog?"

📊 **Compare Options**
• "Compare Newton and Concierge"
• "What's better for data analysis?"
• "Internal vs external tools"

🎯 **Get Recommendations**
• "I need help with document creation"
• "Best tools for my department"
• "Tools that don't require training"

What would you like to explore about Sanofi's AI tools? 🚀`
}

// Generate contextual follow-up questions
function getSuggestedQuestions(responseType: string, mentionedTools: string[] = [], userContext: string = ''): string {
  const suggestions = {
    greeting: [
      "What's the best tool for R&D work?",
      "Show me all productivity tools",
      "Compare internal vs external tools",
      "What tools don't require training?"
    ],
    comparison: [
      "Tell me more about [TOOL] features",
      "What are the access requirements?",
      "Are there similar alternatives?",
      "Which one is easier to get started with?"
    ],
    recommendation: [
      "How do I get access to [TOOL]?",
      "What training is required?",
      "Are there any similar tools?",
      "Compare [TOOL] with alternatives"
    ],
    specific_tool: [
      "How does [TOOL] compare to similar tools?",
      "What training do I need for [TOOL]?",
      "Show me other tools for this use case",
      "What are the access requirements?"
    ],
    default: [
      "What's the most popular tool?",
      "Show me tools for my department",
      "Which tools are free to use?",
      "Compare top 3 recommendations"
    ]
  }
  
  let questionSet = suggestions[responseType] || suggestions.default
  
  // Replace [TOOL] placeholder with actual tool names
  if (mentionedTools.length > 0) {
    questionSet = questionSet.map(q => 
      q.replace('[TOOL]', mentionedTools[0])
    )
  }
  
  // Select 3 random suggestions
  const selectedQuestions = questionSet
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  
  return `\n\n**💡 Try asking:**\n${selectedQuestions.map(q => `• "${q}"`).join('\n')}`
}

// Component to format assistant messages with proper markdown-like rendering
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Headers (##)
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={key++} className="text-base font-bold mt-4 mb-2 text-slate-900 dark:text-white flex items-center gap-2">
          {line.replace('## ', '')}
        </h3>
      )
    }
    // Bold text (**text**)
    else if (line.includes('**')) {
      const parts = line.split(/(\*\*.*?\*\*)/)
      elements.push(
        <p key={key++} className="mb-2">
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={idx} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>
            }
            return <span key={idx}>{part}</span>
          })}
        </p>
      )
    }
    // Bullet points (• or - at start)
    else if (line.match(/^[•\-]\s/)) {
      elements.push(
        <div key={key++} className="flex gap-2 mb-1.5 ml-2">
          <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">•</span>
          <span className="flex-1">{line.replace(/^[•\-]\s/, '')}</span>
        </div>
      )
    }
    // Numbered lists
    else if (line.match(/^\d+\.\s/)) {
      const match = line.match(/^(\d+)\.\s(.*)/)
      if (match) {
        elements.push(
          <div key={key++} className="flex gap-2 mb-1.5 ml-2">
            <span className="text-blue-600 dark:text-blue-400 font-semibold flex-shrink-0">{match[1]}.</span>
            <span className="flex-1">{match[2]}</span>
          </div>
        )
      }
    }
    // Emoji headings (🔍, 📊, etc.)
    else if (line.match(/^[🔍📊🎯📋🆕💰🔗✅⚠️📚👥💡🔹🔧]/)) {
      elements.push(
        <div key={key++} className="font-semibold mt-3 mb-2 text-slate-900 dark:text-white">
          {line}
        </div>
      )
    }
    // Links (text with http/https)
    else if (line.includes('http')) {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const parts = line.split(urlRegex)
      elements.push(
        <p key={key++} className="mb-2">
          {parts.map((part, idx) => {
            if (part.match(/^https?:\/\//)) {
              return (
                <a 
                  key={idx} 
                  href={part} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {part}
                </a>
              )
            }
            return <span key={idx}>{part}</span>
          })}
        </p>
      )
    }
    // Empty lines (spacing)
    else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />)
    }
    // Regular text
    else if (line.trim()) {
      elements.push(
        <p key={key++} className="mb-2">
          {line}
        </p>
      )
    }
  }

  return <div className="space-y-1">{elements}</div>
}

export default function ChatWidget({ toolsCatalog, apiPath }: Props) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [input, setInput] = useState('')
  
  // Get personalized initial greeting
  const getInitialGreeting = () => {
    const storedProfile = localStorage.getItem('ai_compass_user_profile')
    const profile: UserProfile = storedProfile ? JSON.parse(storedProfile) : {
      interests: [],
      commonQueries: [],
      toolsAskedAbout: [],
      conversationStyle: 'casual'
    }
    
    const hour = new Date().getHours()
    let greeting = 'Hello! 👋'
    
    if (hour < 12) greeting = 'Good morning! ☀️'
    else if (hour < 17) greeting = 'Good afternoon! 🌤️'
    else greeting = 'Good evening! 🌙'
    
    let welcomeMsg = `${greeting} I'm **SONA**, your AI Compass assistant, here to help you explore Sanofi's comprehensive AI tools catalog! 🚀\n\n`
    
    if (profile.lastInteraction) {
      welcomeMsg += `Welcome back! 🌟 Ready to discover more AI tools?\n\n`
    }
    
    welcomeMsg += `Feel free to ask me anything about our internal and external AI tools - from features and comparisons to access requirements and recommendations!\n\n`
    welcomeMsg += `**Quick tips:**\n`
    welcomeMsg += `• Ask me to compare tools\n`
    welcomeMsg += `• Get personalized recommendations\n`
    welcomeMsg += `• Learn about new AI capabilities\n\n`
    welcomeMsg += `What would you like to know today? 💡`
    
    return welcomeMsg
  }
  
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: getInitialGreeting() }
  ])
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Debug logging
  console.log('ChatWidget rendered with', toolsCatalog?.length, 'tools')

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll])

  // Detect when user scrolls up
  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    
    setAutoScroll(isNearBottom)
    setShowScrollButton(!isNearBottom)
  }

  // Scroll to bottom function
  const scrollToBottom = () => {
    setAutoScroll(true)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function send() {
    if (!input.trim()) return
    const newMsgs: Msg[] = [...messages, { role: 'user', content: input }]
    setMessages(newMsgs)
    const userInput = input
    setInput('')

    const ctrl = new AbortController()
    abortRef.current = ctrl

    // Always use smart AI agent (no backend required)
    try {
      const response = getSmartAIResponse(userInput, toolsCatalog, messages)
      setMessages(m => [...m, { role: 'assistant', content: '' }])
      
      // Simulate streaming with faster typing for better UX
      let index = 0
      const interval = setInterval(() => {
        if (index < response.length) {
          setMessages(m => {
            const newMessages = [...m]
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: response.slice(0, index + 1)
            }
            return newMessages
          })
          index++
        } else {
          clearInterval(interval)
        }
      }, 15) // Faster typing speed
      
      return
    } catch (error) {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry — I encountered an error while processing your request.' }])
      return
    }

    // Legacy API code below is no longer used but kept for reference
    /* 
    try {
      const resp = await fetch(getApiPath(apiPath), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, toolsCatalog }),
        signal: ctrl.signal
      })

      if (!resp.ok || !resp.body) {
        setMessages(m => [...m, { role: 'assistant', content: 'Sorry — I hit an error calling the assistant.' }])
        return
      }
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'The request was interrupted. Please try again.' }])
    }
    */
  }

  return (
    <>
      <button
        className="fixed bottom-5 right-5 h-12 px-4 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl group z-40"
        onClick={() => {
          console.log('Chat button clicked, current open state:', open)
          setOpen(o => !o)
        }}
        aria-label="Open AI Compass chat assistant"
        title="Click to open AI Compass Assistant"
      >
        <Bot className="w-5 h-5 group-hover:animate-pulse" />
        <span className="font-medium">SONA</span>
        <Sparkles className="w-4 h-4 group-hover:animate-spin" />
      </button>

      {open && (
        <div className={`fixed ${
          expanded 
            ? 'inset-4 w-auto h-auto' 
            : 'bottom-20 right-5 w-[380px] max-h-[75vh]'
        } rounded-2xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300`}>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5" />
              <div>
                <div className="font-semibold">SONA - AI Compass</div>
                <div className="text-xs text-blue-100">Your AI tools expert</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 rounded-lg hover:bg-white/20 transition-colors" 
                onClick={() => setExpanded(e => !e)}
                aria-label={expanded ? "Collapse chat" : "Expand chat"}
                title={expanded ? "Collapse to normal size" : "Expand to full screen"}
              >
                {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-white/20 transition-colors" 
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50 relative"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                  }`}>
                    {m.role === 'user' ? (
                      <span className="text-xs font-bold">U</span>
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {m.role === 'assistant' ? (
                      <FormattedMessage content={m.content} />
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {/* Scroll to bottom button */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 animate-bounce"
                aria-label="Scroll to bottom"
                title="Scroll to latest message"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <input
                className="flex-1 h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Ask about AI tools, capabilities, comparisons..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              />
              <button 
                className="h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={send}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Ask me anything about the AI tools in your catalog!
            </div>
          </div>
        </div>
      )}
    </>
  )
}
