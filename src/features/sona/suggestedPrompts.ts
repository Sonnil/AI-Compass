/**
 * Suggested Prompts System
 * Generates contextual follow-up questions based on conversation history
 */

import type { Msg } from './types'

export interface SuggestedPrompt {
  text: string
  category: 'followup' | 'related' | 'deeper' | 'alternative'
  icon: string
}

/**
 * Analyzes the last assistant message and generates relevant follow-up prompts
 */
export function generateSuggestedPrompts(
  messages: Msg[],
  toolsCatalog: any[]
): SuggestedPrompt[] {
  if (messages.length === 0) {
    return getDefaultPrompts()
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage.role !== 'assistant') {
    return getDefaultPrompts()
  }

  const content = lastMessage.content.toLowerCase()
  const prompts: SuggestedPrompt[] = []

  // Tool recommendation context - extract actual tool names
  if (content.includes('recommend') || content.includes('tool for') || content.includes('i suggest')) {
    // Extract tool names from the recommendation
    const toolNames = extractToolNamesFromContent(content, toolsCatalog)
    
    if (toolNames.length >= 2) {
      prompts.push(
        { text: `Compare ${toolNames[0]} and ${toolNames[1]}`, category: 'followup', icon: '⚖️' },
        { text: `Tell me about ${toolNames[0]}`, category: 'related', icon: '🔍' },
        { text: "Recommend a tool for writing", category: 'alternative', icon: '✍️' },
        { text: "What AI tools does Sanofi have?", category: 'deeper', icon: '🏢' }
      )
    } else if (toolNames.length === 1) {
      prompts.push(
        { text: `Tell me about ${toolNames[0]}`, category: 'followup', icon: '🔍' },
        { text: "Recommend a tool for image generation", category: 'related', icon: '🎨' },
        { text: "What AI tools does Sanofi have?", category: 'alternative', icon: '🏢' },
        { text: "Compare Plai and Concierge", category: 'deeper', icon: '⚖️' }
      )
    } else {
      prompts.push(
        { text: "Recommend a tool for coding", category: 'followup', icon: '💻' },
        { text: "Find tools for data analysis", category: 'related', icon: '📊' },
        { text: "Compare Plai and Concierge", category: 'alternative', icon: '⚖️' },
        { text: "Tell me about Sanofi", category: 'deeper', icon: '🏢' }
      )
    }
  }
  // Tool comparison context
  else if (content.includes('comparison') || content.includes('vs') || content.includes('compare')) {
    const toolNames = extractToolNamesFromContent(content, toolsCatalog)
    
    if (toolNames.length >= 1) {
      prompts.push(
        { text: `How do I access ${toolNames[0]}?`, category: 'followup', icon: '🔑' },
        { text: "Recommend a tool for research", category: 'related', icon: '🔬' },
        { text: "What AI tools does Sanofi have?", category: 'alternative', icon: '🏢' },
        { text: "Tell me about AI Compass features", category: 'deeper', icon: '🧭' }
      )
    } else {
      prompts.push(
        { text: "Compare Plai and Concierge", category: 'followup', icon: '⚖️' },
        { text: "Recommend a tool for writing", category: 'related', icon: '✍️' },
        { text: "Find tools for data analysis", category: 'alternative', icon: '📊' },
        { text: "Tell me about Sanofi", category: 'deeper', icon: '🏢' }
      )
    }
  }
  // Sanofi information context
  else if (content.includes('sanofi') || content.includes('pipeline') || content.includes('therapeutic')) {
    prompts.push(
      { text: "Tell me about Sanofi", category: 'followup', icon: '🏢' },
      { text: "What AI tools does Sanofi have?", category: 'related', icon: '🤖' },
      { text: "Recommend a tool for manufacturing", category: 'alternative', icon: '🏭' },
      { text: "Compare Plai and Concierge", category: 'deeper', icon: '⚖️' }
    )
  }
  // Platform features context
  else if (content.includes('feature') || content.includes('how to') || content.includes('analytics')) {
    prompts.push(
      { text: "Tell me about AI Compass features", category: 'followup', icon: '🧭' },
      { text: "Recommend a tool for coding", category: 'related', icon: '💻' },
      { text: "Compare Plai and Concierge", category: 'alternative', icon: '⚖️' },
      { text: "What AI tools does Sanofi have?", category: 'deeper', icon: '🏢' }
    )
  }
  // Specific tool mentioned
  else if (content.includes('chatgpt') || content.includes('claude') || content.includes('gemini') || 
           content.includes('copilot') || content.includes('midjourney') || content.includes('concierge')) {
    const toolName = extractToolName(content, toolsCatalog)
    if (toolName) {
      prompts.push(
        { text: `Tell me about ${toolName}`, category: 'followup', icon: '🔍' },
        { text: "Recommend a tool for image generation", category: 'related', icon: '🎨' },
        { text: "Compare Plai and Concierge", category: 'alternative', icon: '⚖️' },
        { text: "What AI tools does Sanofi have?", category: 'deeper', icon: '🏢' }
      )
    } else {
      prompts.push(
        { text: "Recommend a tool for writing", category: 'followup', icon: '✍️' },
        { text: "Find tools for data analysis", category: 'related', icon: '📊' },
        { text: "Compare Plai and Concierge", category: 'alternative', icon: '⚖️' },
        { text: "Tell me about Sanofi", category: 'deeper', icon: '🏢' }
      )
    }
  }
  // Creator/builder context
  else if (content.includes('sonnil') || content.includes('built by') || content.includes('creator')) {
    prompts.push(
      { text: "Who created AI Compass?", category: 'followup', icon: '👤' },
      { text: "Tell me about AI Compass features", category: 'related', icon: '🧭' },
      { text: "Recommend a tool for coding", category: 'alternative', icon: '💻' },
      { text: "What AI tools does Sanofi have?", category: 'deeper', icon: '🏢' }
    )
  }
  // Error/not found context
  else if (content.includes("couldn't find") || content.includes("not trained") || content.includes("don't have")) {
    prompts.push(
      { text: "Recommend a tool for writing", category: 'followup', icon: '✍️' },
      { text: "Compare Plai and Concierge", category: 'related', icon: '⚖️' },
      { text: "What AI tools does Sanofi have?", category: 'alternative', icon: '🏢' },
      { text: "Tell me about AI Compass features", category: 'deeper', icon: '🧭' }
    )
  }
  // Generic greeting/help context
  else if (content.includes('hello') || content.includes('how can i help') || content.includes('what can you') || messages.length <= 2) {
    prompts.push(
      { text: "Recommend a tool for writing", category: 'followup', icon: '✍️' },
      { text: "What AI tools does Sanofi have?", category: 'related', icon: '🏢' },
      { text: "Compare Plai and Concierge", category: 'alternative', icon: '⚖️' },
      { text: "Tell me about AI Compass features", category: 'deeper', icon: '🧭' }
    )
  }
  // Default fallback if no context matched
  else {
    return getContextualPrompts(content, toolsCatalog)
  }

  // Return max 4 prompts
  return prompts.slice(0, 4)
}

/**
 * Extract tool name from content
 */
function extractToolName(content: string, toolsCatalog: any[]): string | null {
  const lowerContent = content.toLowerCase()
  for (const tool of toolsCatalog) {
    if (lowerContent.includes(tool.name.toLowerCase())) {
      return tool.name
    }
  }
  return null
}

/**
 * Extract multiple tool names from content
 */
function extractToolNamesFromContent(content: string, toolsCatalog: any[]): string[] {
  const lowerContent = content.toLowerCase()
  const foundTools: string[] = []
  
  for (const tool of toolsCatalog) {
    if (lowerContent.includes(tool.name.toLowerCase())) {
      foundTools.push(tool.name)
      if (foundTools.length >= 3) break // Max 3 tools
    }
  }
  
  return foundTools
}

/**
 * Get contextual prompts based on content keywords
 */
function getContextualPrompts(content: string, toolsCatalog: any[]): SuggestedPrompt[] {
  const prompts: SuggestedPrompt[] = [
    { text: "Recommend a tool for coding", category: 'related', icon: '💻' },
    { text: "Compare Plai and Concierge", category: 'alternative', icon: '⚖️' },
    { text: "What AI tools does Sanofi have?", category: 'deeper', icon: '🏢' },
    { text: "Tell me about AI Compass features", category: 'followup', icon: '🧭' }
  ]

  return prompts.slice(0, 4)
}

/**
 * Get default prompts when no conversation history
 */
function getDefaultPrompts(): SuggestedPrompt[] {
  return [
    { text: "Recommend a tool for writing", category: 'followup', icon: '✍️' },
    { text: "What AI tools does Sanofi have?", category: 'related', icon: '🏢' },
    { text: "Compare Plai and Concierge", category: 'deeper', icon: '⚖️' },
    { text: "Tell me about AI Compass features", category: 'alternative', icon: '🧭' }
  ]
}

/**
 * Get initial welcome prompts
 */
export function getWelcomePrompts(): SuggestedPrompt[] {
  return [
    { text: "Recommend a tool for data analysis", category: 'followup', icon: '📊' },
    { text: "What AI tools does Sanofi have?", category: 'related', icon: '🏢' },
    { text: "Compare Plai and Concierge", category: 'deeper', icon: '⚖️' },
    { text: "Tell me about AI Compass features", category: 'alternative', icon: '🧭' }
  ]
}
