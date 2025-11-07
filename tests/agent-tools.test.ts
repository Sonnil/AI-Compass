import { describe, it, expect } from 'vitest'
import { executeTool } from '../src/features/sona/agent.js'

const tools = [
  { name: 'Concierge', type: 'internal', primaryPurpose: 'Productivity', tags: ['productivity','collaboration'] },
  { name: 'MedIS', type: 'internal', primaryPurpose: 'Data analytics', tags: ['data','analytics'] },
  { name: 'ChatGPT', type: 'external', primaryPurpose: 'Creative writing', tags: ['creative','writing'] },
]

describe('executeTool', () => {
  it('recommends tools based on keywords', async () => {
    const res = await executeTool('recommendTool', { query: 'recommend a data analytics tool' }, tools as any, { name: 't', interests: [], commonQueries: [], toolsAskedAbout: [], conversationStyle: 'casual' } as any)
    expect(res.ok).toBe(true)
    expect(Array.isArray(res.data)).toBe(true)
    const names = (res.data as any[]).map(t => t.name)
    expect(names).toContain('MedIS')
  })

  it('compares tools by names', async () => {
    const res = await executeTool('compareTools', { toolIds: ['Concierge','ChatGPT'] }, tools as any, { name: 't', interests: [], commonQueries: [], toolsAskedAbout: [], conversationStyle: 'casual' } as any)
    expect(res.ok).toBe(true)
    const names = (res.data as any[]).map(t => t.name)
    expect(names).toEqual(['Concierge','ChatGPT'])
  })
})
