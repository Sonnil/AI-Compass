import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateIntelligentResponse } from '../src/features/sona/responses.js'

// Mock aiChatClient to avoid network
vi.mock('../src/services/aiChatClient.js', () => ({
  callAiChat: vi.fn(async () => 'mocked agent response'),
}))

const userProfile = { name: 'Tester', interests: [], commonQueries: [], toolsAskedAbout: [], conversationStyle: 'casual' }

describe('generateIntelligentResponse', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('responds to greetings like "hello sona"', async () => {
    const out = await generateIntelligentResponse('hello Sona', [], userProfile as any)
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(3)
  })

  it('answers identity/capabilities', async () => {
    const out = await generateIntelligentResponse('what can you do?', [], userProfile as any)
    expect(out.toLowerCase()).toContain('sona')
    expect(out.toLowerCase()).toContain('what i can do')
  })

  it('answers expanded identity when asked who are you', async () => {
    const out = await generateIntelligentResponse('who are you', [], userProfile as any)
    expect(out.toLowerCase()).toContain('organizational navigation assistant')
  })

  it('acknowledges who built you', async () => {
    const out = await generateIntelligentResponse('who built you?', [], userProfile as any)
    expect(out.toLowerCase()).toContain('sonnil')
  })

  it('uses external agent for open-ended queries', async () => {
    const out = await generateIntelligentResponse('tell me something about AI research', [], userProfile as any)
    expect(out).toBe('mocked agent response')
  })

  it('formats tool result for compareTools', async () => {
    const toolResult = { ok: true, data: [{ name: 'A', type: 'internal' }, { name: 'B', type: 'external' }], meta: { toolName: 'compareTools', toolInput: { toolIds: ['A','B'] } } }
    const out = await generateIntelligentResponse('compare A and B', [], userProfile as any, toolResult as any)
    expect(out).toContain('Comparison')
    expect(out).toContain('A')
    expect(out).toContain('B')
  })

  it('translates simple phrase requests', async () => {
    const out = await generateIntelligentResponse('translate hello to french', [], userProfile as any)
    expect(out.toLowerCase()).toContain('bonjour')
  })

  it('routes Sanofi info to knowledge', async () => {
    const out = await generateIntelligentResponse('tell me about Sanofi', [], userProfile as any)
    expect(out).toContain('About Sanofi')
  })

  it('routes AI Compass comparison feature help', async () => {
    const out = await generateIntelligentResponse('how does AI Compass comparison work?', [], userProfile as any)
    expect(out).toContain('Tool Comparison Feature')
  })

  it('handles weather as out-of-scope gracefully', async () => {
    const out = await generateIntelligentResponse("how's the weather?", [], userProfile as any)
    expect(out.toLowerCase()).toContain("don't have live weather data access")
  })

  it('guides when asked about highest rated tool', async () => {
    const out = await generateIntelligentResponse('what is the highest rating tool', [], userProfile as any)
    expect(out.toLowerCase()).toContain('track star ratings')
  })
})
