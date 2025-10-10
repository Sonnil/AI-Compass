import React, { useRef, useState } from 'react'
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react'

type Msg = { role: 'user' | 'assistant', content: string }

type Props = {
  toolsCatalog: any[]
  /** Optional: override API path (default uses VITE_CHAT_API_PATH or '/api/ai-chat') */
  apiPath?: string
}

function getApiPath(override?: string) {
  // For now, we'll use a simple fallback - can be configured later
  return override || '/api/ai-chat'
}

// Enhanced AI Agent with real intelligence
function getSmartAIResponse(userInput: string, toolsCatalog: any[], conversationHistory: Msg[]): string {
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
  return generateIntelligentResponse(systemPrompt, userInput, toolsCatalog)
}

function generateIntelligentResponse(systemPrompt: string, userInput: string, toolsCatalog: any[]): string {
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

  // Greeting responses
  if (detectedIntents.includes('greeting')) {
    const internalCount = toolsCatalog.filter(t => t.type === 'internal').length
    const externalCount = toolsCatalog.filter(t => t.type === 'external').length
    const response = `Hello! 👋 I'm your AI Compass assistant, and I know all about Sanofi's comprehensive AI tools catalog with **${internalCount} internal** and **${externalCount} external** tools.

I can help you:
🔍 **Find the right tool** for your specific needs
📊 **Compare tools** to see which works best  
🎯 **Get recommendations** based on your role or project
📋 **Check access requirements** and training needs
🆕 **Discover new AI tools** like Claude 3, Gemini, Perplexity AI, and more!`
    
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

export default function ChatWidget({ toolsCatalog, apiPath }: Props) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI Compass assistant. Ask me about any AI tool from our comprehensive catalog including internal Sanofi tools and the latest external AI platforms like Claude 3, Google Gemini, Perplexity AI, and more! 🚀' }
  ])
  const abortRef = useRef<AbortController | null>(null)

  // Debug logging
  console.log('ChatWidget rendered with', toolsCatalog?.length, 'tools')

  async function send() {
    if (!input.trim()) return
    const newMsgs: Msg[] = [...messages, { role: 'user', content: input }]
    setMessages(newMsgs)
    const userInput = input
    setInput('')

    const ctrl = new AbortController()
    abortRef.current = ctrl

    // Development mode - use smart AI agent
    if (window.location.hostname === 'localhost') {
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
    }

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

      // Stream the answer (SSE-like text stream from the proxy)
      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      setMessages(m => [...m, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })

        // Supports both raw text streaming and OpenAI SSE 'data:' lines
        if (chunk.includes('\ndata:')) {
          chunk.split('\n').forEach(line => {
            if (!line.startsWith('data:')) return
            const data = line.replace(/^data:\s*/, '')
            if (data === '[DONE]') return
            try {
              const json = JSON.parse(data)
              const delta = json?.choices?.[0]?.delta?.content || ''
              if (delta) {
                assistantText += delta
                setMessages(prev => {
                  const copy = [...prev]
                  copy[copy.length - 1] = { role: 'assistant', content: assistantText }
                  return copy
                })
              }
            } catch {}
          })
        } else {
          // naive: treat as plain text stream
          assistantText += chunk
          setMessages(prev => {
            const copy = [...prev]
            copy[copy.length - 1] = { role: 'assistant', content: assistantText }
            return copy
          })
        }
      }
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'The request was interrupted. Please try again.' }])
    }
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
        <span className="font-medium">AI Assistant</span>
        <Sparkles className="w-4 h-4 group-hover:animate-spin" />
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-[380px] max-h-[75vh] rounded-2xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5" />
              <div>
                <div className="font-semibold">AI Compass Assistant</div>
                <div className="text-xs text-blue-100">Your AI tools expert</div>
              </div>
            </div>
            <button 
              className="p-2 rounded-lg hover:bg-white/20 transition-colors" 
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50">
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
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
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
