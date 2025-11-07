import { describe, it, expect } from 'vitest'
import { decideToolCall } from '../src/features/sona/intents.js'

const tools = [
  { name: 'Concierge', tags: ['productivity'] },
  { name: 'Copilot', tags: ['productivity'] },
  { name: 'ChatGPT', tags: ['creative','writing'] },
  { name: 'Newton', tags: ['research'] },
  { name: 'MedIS', tags: ['data'] },
]

describe('decideToolCall', () => {
  it('detects compare tools with names', () => {
    const res = decideToolCall('Compare Concierge vs ChatGPT', tools)
    expect(res?.toolName).toBe('compareTools')
    // ensure both are passed
    expect(res?.toolInput.toolIds).toContain('Concierge')
    expect(res?.toolInput.toolIds).toContain('ChatGPT')
  })

  it('detects category compare', () => {
    const res = decideToolCall('Compare productivity tools', tools)
    expect(res?.toolName).toBe('compareTools')
    expect(Array.isArray(res?.toolInput.toolIds)).toBe(true)
  })

  it('detects recommend by topic', () => {
    const res = decideToolCall('what about data analytics?', tools)
    expect(res?.toolName).toBe('recommendTool')
  })

  it('detects sanofi info', () => {
    const res = decideToolCall('tell me about Sanofi', tools)
    expect(res?.toolName).toBe('getSanofiInfo')
  })

  it('detects fun content', () => {
    const res = decideToolCall('tell me a joke', tools)
    expect(res?.toolName).toBe('getAIJoke')
  })

  it('detects audience-based recommend for manufacturing', () => {
    const res = decideToolCall('which tool is best for manufacturing users', tools)
    expect(res?.toolName).toBe('recommendTool')
    // Should carry normalized keywords for recommender
    expect(Array.isArray(res?.toolInput.keywords)).toBe(true)
    expect(res?.toolInput.keywords.join(' ')).toContain('manufacturing')
  })

  it('detects audience-based recommend for shop floor QA', () => {
    const res = decideToolCall('which tool is best for shop floor QA', tools)
    expect(res?.toolName).toBe('recommendTool')
    expect(Array.isArray(res?.toolInput.keywords)).toBe(true)
    const kw = res?.toolInput.keywords.join(' ').toLowerCase()
    expect(kw).toMatch(/quality|inspection|manufacturing/)
  })
})
