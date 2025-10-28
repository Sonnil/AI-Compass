import React, { useRef, useState, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Sparkles, Maximize2, Minimize2, ArrowDown, ThumbsUp, ThumbsDown } from 'lucide-react'
import type { Msg, UserProfile } from '../../features/sona/types'
import { generateIntelligentResponse, decideToolCall, executeTool, storeFeedback, getLearningInsights } from '../../features/sona/agent'
import { getGreeting, streamResponse } from '../../features/sona/utils'
import { getAITipOfTheDay } from '../../features/sona/knowledge'

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
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

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

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return

    const userMessage: Msg = { role: 'user', content: input }
    const currentMessages = [...messages, userMessage]
    setMessages(currentMessages)
    setInput('')
    setIsLoading(true)

    // Update user profile
    const updatedProfile = updateUserProfile(input, messages, toolsCatalog)
    setUserProfile(updatedProfile)

    // Agentic logic
    const toolCall = decideToolCall(input, toolsCatalog)
    let responseContent = ''

    if (toolCall) {
      const toolResult = await executeTool(toolCall.toolName, toolCall.toolInput, toolsCatalog, updatedProfile)
      responseContent = await generateIntelligentResponse(input, currentMessages, updatedProfile, { ...toolResult, meta: { toolName: toolCall.toolName, toolInput: toolCall.toolInput } })
    } else {
      responseContent = await generateIntelligentResponse(input, currentMessages, updatedProfile)
    }

    const assistantMessage: Msg = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMessage])

    // Stream the final response
    const stream = streamResponse(responseContent)
    for await (const chunk of stream) {
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].content = chunk
        return newMessages
      })
    }

    setIsLoading(false)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Reset to default state when opening
      setIsMaximized(false)
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
    <div className={`fixed bottom-5 right-5 bg-white dark:bg-gray-800 shadow-2xl rounded-lg transition-all duration-300 z-50 ${isMaximized ? 'w-[95vw] h-[90vh]' : 'w-96 h-[600px]'}`}>
      <div className="flex justify-between items-center p-4 bg-purple-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <Bot size={24} className="mr-2" />
          <h3 className="font-bold text-lg">SONA Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={toggleMaximize} className="hover:bg-purple-700 p-1 rounded-full">
            {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          <button onClick={toggleOpen} className="hover:bg-purple-700 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>
      </div>
      <div ref={chatContainerRef} onScroll={handleScroll} className="h-[calc(100%-140px)] overflow-y-auto p-4 flex flex-col space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'assistant' && !msg.content.includes('Thank you for') && (
              <div className="flex items-center gap-2 mt-2 ml-2">
                <button
                  onClick={() => handleFeedback(index, 'positive')}
                  disabled={!!msg.feedback}
                  className={`p-1.5 rounded-lg transition-all ${
                    msg.feedback === 'positive'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-green-100 dark:hover:bg-green-900 text-gray-600 dark:text-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title="This was helpful"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleFeedback(index, 'negative')}
                  disabled={!!msg.feedback}
                  className={`p-1.5 rounded-lg transition-all ${
                    msg.feedback === 'negative'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-red-100 dark:hover:bg-red-900 text-gray-600 dark:text-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title="This needs improvement"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
                {msg.feedback && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    {msg.feedback === 'positive' ? '✓ Helpful' : '✗ Needs work'}
                  </span>
                )}
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask SONA anything..."
            className="flex-grow p-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading} className="p-3 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 disabled:text-gray-400">
            {isLoading ? <Sparkles size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
