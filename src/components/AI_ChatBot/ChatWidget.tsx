import React, { useRef, useState, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Sparkles, Maximize2, Minimize2, ArrowDown, ThumbsUp, ThumbsDown } from 'lucide-react'
import type { Msg, UserProfile } from '../../features/sona/types'
import { generateIntelligentResponse, decideToolCall, executeTool } from '../../features/sona/agent.js'
import { storeFeedback } from '../../features/sona/learning.js';
import feedbackHelper from '../../features/sona/feedback.js';
import { getGreeting, streamResponse } from '../../features/sona/utils.js';
import { getAITipOfTheDay } from '../../features/sona/knowledge.js';
import { callAiChatStream } from '../../services/aiChatClient.js'

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
    if (input.includes(tool.id.toLowerCase()) && !profile.toolsAskedAbout.includes(tool.id)) {
      profile.toolsAskedAbout.push(tool.id)
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
  const [feedbackState, setFeedbackState] = useState<{ ack?: string } | null>(null)
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

    // Always add placeholder assistant message to stream into
    const assistantMessage: Msg = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMessage])

    if (toolCall) {
      // Use existing local generation path when a specific tool is invoked
      const toolResult = await executeTool(toolCall.toolName, toolCall.toolInput, toolsCatalog, updatedProfile)
      responseContent = await generateIntelligentResponse(input, currentMessages, updatedProfile, { ...toolResult, meta: { toolName: toolCall.toolName, toolInput: toolCall.toolInput } })
      const stream = streamResponse(responseContent)
      for await (const chunk of stream) {
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].content = chunk
          return newMessages
        })
      }
    } else {
      // Real streaming from backend agent via SSE
      try {
        for await (const delta of callAiChatStream(currentMessages, toolsCatalog)) {
          setMessages(prev => {
            const newMessages = [...prev]
            const last = newMessages[newMessages.length - 1]
            last.content = (last.content || '') + delta
            return newMessages
          })
        }
      } catch (e) {
        // Fallback to local generator if backend fails
        responseContent = await generateIntelligentResponse(input, currentMessages, updatedProfile)
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
          <div key={index} className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

              {/* Feedback buttons for assistant messages */}
              {msg.role === 'assistant' && (
                <div className="mt-2 flex items-center space-x-2">
                  <button
                    onClick={async () => {
                      // Find the most recent user message before this assistant message
                      const prevUserIndex = (() => {
                        for (let i = index - 1; i >= 0; i--) {
                          if (messages[i].role === 'user') return i
                        }
                        return -1
                      })()

                      const userQuery = prevUserIndex !== -1 ? messages[prevUserIndex].content : ''
                      try {
                        storeFeedback(userQuery, msg.content, 'positive')
                        setFeedbackState({ ack: 'Thanks — your thumbs-up helps SONA learn!' })
                        setTimeout(() => setFeedbackState(null), 2500)
                      } catch (err) {
                        setFeedbackState({ ack: 'Could not save feedback locally.' })
                        setTimeout(() => setFeedbackState(null), 2500)
                      }
                    }}
                    title="Thumbs up"
                    className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <ThumbsUp size={16} />
                  </button>

                  <button
                    onClick={async () => {
                      // Find the most recent user message before this assistant message
                      const prevUserIndex = (() => {
                        for (let i = index - 1; i >= 0; i--) {
                          if (messages[i].role === 'user') return i
                        }
                        return -1
                      })()

                      const userQuery = prevUserIndex !== -1 ? messages[prevUserIndex].content : ''
                      // Ask for optional reason
                      const reason = window.prompt('Tell us (briefly) what was wrong with the response (optional):') || undefined
                      const userProfileRaw = localStorage.getItem('ai_compass_user_profile')
                      const userId = userProfileRaw ? JSON.parse(userProfileRaw).name || undefined : undefined
                      const messageId = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`

                      try {
                        await feedbackHelper.recordThumbsDown({ query: userQuery, response: msg.content, reason, userId, messageId })
                        setFeedbackState({ ack: 'Thanks — your feedback has been recorded for review.' })
                        setTimeout(() => setFeedbackState(null), 3000)
                      } catch (err) {
                        setFeedbackState({ ack: 'Could not save feedback locally.' })
                        setTimeout(() => setFeedbackState(null), 2500)
                      }
                    }}
                    title="Report problem / Thumbs down"
                    className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <ThumbsDown size={16} />
                  </button>

                  {feedbackState?.ack && (
                    <span className="text-xs text-gray-600 dark:text-gray-300 ml-2">{feedbackState.ack}</span>
                  )}
                </div>
              )}
            </div>
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
