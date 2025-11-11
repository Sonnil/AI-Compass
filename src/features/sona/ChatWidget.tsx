import React, { useRef, useState, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Sparkles, Maximize2, Minimize2, ArrowDown, ThumbsUp, ThumbsDown, Activity, Brain } from 'lucide-react'
import type { Msg, UserProfile } from '../../features/sona/types'
import { generateIntelligentResponse, decideToolCall, executeTool } from '../../features/sona/agent.js'
import { storeFeedback, getLearningInsights } from '../../features/sona/learning.js'
import { getGreeting, streamResponse } from '../../features/sona/utils'
import { getAITipOfTheDay } from '../../features/sona/knowledge'
import { callAiChatStream } from '../../services/aiChatClient.js'
import { createEnhancedAgent } from './enhancedAgent'
import { generateSuggestedPrompts, getWelcomePrompts, type SuggestedPrompt } from './suggestedPrompts'
import { ThinkingProcess } from '../../components/ThinkingProcess'
import { TraceViewer } from '../../components/TraceViewer'
import { FeedbackPanel, type FeedbackData } from '../../components/FeedbackPanel'
import LearningDashboard from '../../components/LearningDashboard'
import { learningService } from '../../services/learning/learningService'

type Props = {
  toolsCatalog: any[]
}

// Learn from user interactions and build profile
function updateUserProfile(userInput: string, conversationHistory: Msg[], toolsCatalog: any[]): UserProfile {
  const storedProfile = localStorage.getItem('ai_compass_user_profile')
  const profile: UserProfile = storedProfile ? JSON.parse(storedProfile) : {
    name: 'There', // Default name
    interests: [],
    commonQueries: [],
    toolsAskedAbout: [],
    conversationStyle: 'casual',
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

export default function ChatWidget({ toolsCatalog }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'There', interests: [], commonQueries: [], toolsAskedAbout: [], conversationStyle: 'casual' })
  const [showScroll, setShowScroll] = useState(false)
  const [suggestedPrompts, setSuggestedPrompts] = useState<SuggestedPrompt[]>(getWelcomePrompts())
  const [showTraceViewer, setShowTraceViewer] = useState(false)
  const [showThinkingProcess, setShowThinkingProcess] = useState(false)
  const [showLearningDashboard, setShowLearningDashboard] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Initialize enhanced agent - will be updated when toolsCatalog changes
  const enhancedAgent = useRef(createEnhancedAgent(toolsCatalog))

  // Update enhanced agent when tools catalog changes
  useEffect(() => {
    if (toolsCatalog && toolsCatalog.length > 0) {
      console.log('🔄 [ChatWidget] Updating enhanced agent with', toolsCatalog.length, 'tools')
      enhancedAgent.current = createEnhancedAgent(toolsCatalog)
    }
  }, [toolsCatalog])

  useEffect(() => {
    const storedProfile = localStorage.getItem('ai_compass_user_profile')
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    }
    
    // Initial greeting message
    setMessages([{
      role: 'assistant',
      content: `${getGreeting()} ${storedProfile ? JSON.parse(storedProfile).name || 'There' : 'There'}! I'm SONA, your AI Compass assistant. Today's tip:\n\n${getAITipOfTheDay()}`
    }])
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMaximized])

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isScrolledUp = scrollTop < scrollHeight - clientHeight - 100
      setShowScroll(isScrolledUp)
    }
  }
  
  const handleSuggestedPromptClick = (promptText: string) => {
    // Directly send the suggested prompt
    handleSend(promptText)
  }

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input
    if (textToSend.trim() === '' || isLoading) return

    const userMessage: Msg = { role: 'user', content: textToSend }
    const currentMessages = [...messages, userMessage]
    setMessages(currentMessages)
    setInput('')
    setIsLoading(true)

    // Update user profile
    const updatedProfile = updateUserProfile(textToSend, messages, toolsCatalog)
    setUserProfile(updatedProfile)

    // Always add placeholder assistant message to stream into
    const assistantMessage: Msg = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMessage])

    // Check if we should use enhanced agent
    const useEnhanced = enhancedAgent.current.shouldUseEnhancedAgent(textToSend)
    console.log('🧠 [ChatWidget] Use enhanced agent:', useEnhanced, 'for query:', textToSend)

    if (useEnhanced) {
      // Use enhanced agent with intent classification
      console.log('✨ [ChatWidget] Using enhanced agent with tracing')
      setShowThinkingProcess(true) // Show thinking process
      try {
        const responseContent = await enhancedAgent.current.processMessage(textToSend, currentMessages, updatedProfile)
        console.log('📝 [ChatWidget] Enhanced response:', responseContent.slice(0, 200))
        
        // Hide thinking process before streaming response
        setShowThinkingProcess(false)
        
        // Stream the response
        const stream = streamResponse(responseContent)
        for await (const chunk of stream) {
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = chunk
            return newMessages
          })
        }
      } catch (error) {
        console.error('❌ [ChatWidget] Enhanced agent error:', error)
        setShowThinkingProcess(false)
        // Fallback to original logic
        const responseContent = await generateIntelligentResponse(textToSend, currentMessages, updatedProfile)
        const stream = streamResponse(responseContent)
        for await (const chunk of stream) {
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = chunk
            return newMessages
          })
        }
      }
    } else {
      // Use original agentic logic for other queries
      const toolCall = decideToolCall(textToSend, toolsCatalog)
      console.log('🔍 [ChatWidget] toolCall decision:', toolCall)
      let responseContent = ''

      if (toolCall) {
        console.log('🛠️ [ChatWidget] Executing tool:', toolCall.toolName)
        const toolResult = await executeTool(toolCall.toolName, toolCall.toolInput, toolsCatalog, updatedProfile)
        console.log('🛠️ [ChatWidget] Tool result:', toolResult)
        responseContent = await generateIntelligentResponse(textToSend, currentMessages, updatedProfile, { ...toolResult, meta: { toolName: toolCall.toolName, toolInput: toolCall.toolInput } })
        console.log('📝 [ChatWidget] Response content:', responseContent.slice(0, 200))
        const stream = streamResponse(responseContent)
        for await (const chunk of stream) {
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = chunk
            return newMessages
          })
        }
      } else {
        console.log('🌐 [ChatWidget] No tool call, trying external API')
        try {
          for await (const delta of callAiChatStream(currentMessages, toolsCatalog)) {
            setMessages(prev => {
              const newMessages = [...prev]
              const last = newMessages[newMessages.length - 1]
              last.content = (last.content || '') + delta
              return newMessages
            })
          }
          console.log('✅ [ChatWidget] External API succeeded')
        } catch (e) {
          console.log('❌ [ChatWidget] External API failed, using fallback:', e)
          responseContent = await generateIntelligentResponse(textToSend, currentMessages, updatedProfile)
          console.log('📝 [ChatWidget] Fallback response:', responseContent.slice(0, 200))
          const stream = streamResponse(responseContent)
          for await (const chunk of stream) {
            setMessages(prev => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1].content = chunk
              return newMessages
            })
          }
        }
      }
    }

    setIsLoading(false)

    // Update suggested prompts based on the new conversation context
    setTimeout(() => {
      setSuggestedPrompts(generateSuggestedPrompts(messages, toolsCatalog))
    }, 500)
    
    // Refocus the input field so user can continue typing
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Reset to default state when opening
      setIsMaximized(false)
      // Focus input when opening
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const handleFeedback = (messageIndex: number, feedback: 'positive' | 'negative') => {
    const message = messages[messageIndex]
    if (message.role !== 'assistant' || message.feedback) return // Already has feedback
    
    // Find the corresponding user message
    const userMessage = messages[messageIndex - 1]
    if (!userMessage || userMessage.role !== 'user') return
    
    // Store feedback for ML
    storeFeedback(userMessage.content, message.content, feedback)
    
    // Update message with feedback
    setMessages(prev => {
      const newMessages = [...prev]
      newMessages[messageIndex] = { ...newMessages[messageIndex], feedback, timestamp: new Date().toISOString() }
      return newMessages
    })
    
    // Show thank you message
    const thankYouMessage: Msg = {
      role: 'assistant',
      content: feedback === 'positive' 
        ? "Thank you for the positive feedback! 🎉 I'm learning and improving with every interaction!"
        : "Thank you for the feedback. I'll work on improving my responses. Your input helps me learn! 📚"
    }
    setTimeout(() => {
      setMessages(prev => [...prev, thankYouMessage])
    }, 500)
  }

  if (!isOpen) {
    return (
      <button
        onClick={toggleOpen}
        className="fixed bottom-5 right-5 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110 z-50"
        aria-label="Open SONA Chat"
      >
        <MessageSquare size={24} />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-5 right-5 bg-white dark:bg-gray-800 shadow-2xl rounded-lg transition-all duration-300 z-50 flex flex-col ${isMaximized ? 'w-[95vw] h-[90vh]' : 'w-96 h-[600px]'}`}>
      <div className="flex justify-between items-center p-4 bg-purple-600 text-white rounded-t-lg flex-shrink-0">
        <div className="flex items-center">
          <Bot size={24} className="mr-2" />
          <h3 className="font-bold text-lg">SONA Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowTraceViewer(true)} 
            className="hover:bg-purple-700 p-1 rounded-full transition-colors"
            title="View Trace Details"
          >
            <Activity size={20} />
          </button>
          <button 
            onClick={() => setShowLearningDashboard(true)} 
            className="hover:bg-purple-700 p-1 rounded-full transition-colors"
            title="Learning Analytics"
          >
            <Brain size={20} />
          </button>
          <button onClick={toggleMaximize} className="hover:bg-purple-700 p-1 rounded-full">
            {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          <button onClick={toggleOpen} className="hover:bg-purple-700 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>
      </div>
      <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 bg-gray-50 dark:bg-gray-900">
        {/* Thinking Process Display */}
        <ThinkingProcess isVisible={showThinkingProcess} />
        
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'assistant' && !msg.content.includes('Thank you for') && (
              <div className="mt-2 ml-2">
                <FeedbackPanel
                  messageId={`msg_${index}`}
                  onFeedbackSubmit={(feedback: FeedbackData) => {
                    // Record feedback in enhanced agent
                    enhancedAgent.current.recordFeedback(
                      feedback.helpful,
                      feedback.satisfaction
                    )
                    
                    // Update message with feedback for UI
                    setMessages(prev => {
                      const newMessages = [...prev]
                      newMessages[index] = {
                        ...newMessages[index],
                        feedback: feedback.helpful ? 'positive' : 'negative'
                      }
                      return newMessages
                    })
                  }}
                />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {showScroll && (
        <button onClick={scrollToBottom} className="absolute bottom-24 right-5 bg-purple-500 text-white p-2 rounded-full shadow-md hover:bg-purple-600">
          <ArrowDown size={20} />
        </button>
      )}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        {/* Suggested Prompts */}
        {!isLoading && suggestedPrompts.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-600">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedPromptClick(prompt.text)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200 border border-purple-200 dark:border-purple-700 hover:scale-105 flex-shrink-0"
                title={`Click to ask: ${prompt.text}`}
              >
                <span className="text-sm">{prompt.icon}</span>
                <span className="whitespace-nowrap">{prompt.text}</span>
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask SONA anything..."
            className="flex-grow p-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            disabled={isLoading}
          />
          <button onClick={() => handleSend()} disabled={isLoading} className="p-3 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 disabled:text-gray-400">
            {isLoading ? <Sparkles size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
      
      {/* Trace Viewer Modal */}
      <TraceViewer isOpen={showTraceViewer} onClose={() => setShowTraceViewer(false)} />
      
      {/* Learning Dashboard Modal */}
      {showLearningDashboard && (
        <LearningDashboard
          interactions={learningService.getInteractions()}
          preferences={learningService.getUserPreferences(userProfile.name) || {
            userId: userProfile.name,
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
          }}
          model={learningService.getLearningModel()}
          onClose={() => setShowLearningDashboard(false)}
          onExportData={() => {
            const data = enhancedAgent.current.exportLearningData()
            const blob = new Blob([data], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `sona-learning-data-${new Date().toISOString()}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }}
        />
      )}
    </div>
  )
}
