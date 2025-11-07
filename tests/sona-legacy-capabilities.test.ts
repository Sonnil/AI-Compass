import { describe, it, expect, beforeAll } from 'vitest'
import { generateIntelligentResponse } from '../src/features/sona/responses.js'
import { decideToolCall, executeTool } from '../src/features/sona/agent.js'

const userProfile = { name: 'Tester', interests: [], commonQueries: [], toolsAskedAbout: [], conversationStyle: 'casual' }

// Minimal mock catalog approximating pre-refactor tools
const toolsCatalog = [
  {
    name: 'AI Research Factory',
    type: 'internal',
    primaryPurpose: 'R&D drug discovery acceleration',
    bestUseCase: 'Drug discovery',
    targetUsers: 'R&D, scientists',
    tags: ['research', 'r&d', 'science']
  },
  {
    name: 'Newton',
    type: 'internal',
    primaryPurpose: 'R&D scientific assistant',
    bestUseCase: 'Scientific research and literature review',
    targetUsers: 'R&D, scientists',
    tags: ['research', 'analysis']
  },
  {
    name: 'MedIS',
    type: 'internal',
    primaryPurpose: 'Medical insights engine',
    bestUseCase: 'Medical insights and compliance',
    targetUsers: 'Medical, clinicians, QA/QC',
    tags: ['data', 'medical']
  },
  {
    name: 'GenAI Platform',
    type: 'internal',
    primaryPurpose: 'Foundation for AI applications',
    bestUseCase: 'Building AI applications and services',
    targetUsers: 'Engineering, platform, developers',
    tags: ['platform', 'engineering']
  },
  {
    name: 'Concierge',
    type: 'external',
    primaryPurpose: 'Productivity assistant',
    bestUseCase: 'General productivity',
    targetUsers: 'All employees',
    tags: ['productivity']
  },
  {
    name: 'ChatGPT',
    type: 'external',
    primaryPurpose: 'Creative writing and Q&A',
    bestUseCase: 'Writing and ideation',
    targetUsers: 'All employees',
    tags: ['creative', 'writing']
  }
]

describe('SONA legacy capabilities (pre-refactor expectations)', () => {
  describe('Identity and greetings', () => {
    it('greets with intro, capabilities and a lighthearted snippet', async () => {
      const out = await generateIntelligentResponse('hello', [], userProfile as any)
      expect(out.toLowerCase()).toContain("i'm sona")
      expect(out.toLowerCase()).toContain('i can help you')
    })

    it('answers expanded identity with competencies and mission', async () => {
      const out = await generateIntelligentResponse('who are you?', [], userProfile as any)
      expect(out.toLowerCase()).toContain('organizational navigation assistant')
      expect(out.toLowerCase()).toContain('what i can do')
      expect(out.toLowerCase()).toContain('mission')
    })

    it('acknowledges who built you (Sonnil)', async () => {
      const out = await generateIntelligentResponse('who built you', [], userProfile as any)
      expect(out.toLowerCase()).toContain('sonnil')
    })
  })

  describe('Translations', () => {
    it('translates hello -> french quickly (dictionary fast path)', async () => {
      const out = await generateIntelligentResponse('translate hello to french', [], userProfile as any)
      expect(out.toLowerCase()).toContain('bonjour')
    })

    it('translates bonjour -> english (pre-refactor API path)', async () => {
      // Pre-refactor expected to succeed via API; current version may fail (regression)
      const out = await generateIntelligentResponse('translate bonjour to english', [], userProfile as any)
      expect(out.toLowerCase()).toContain('hello')
    })

    it('translates quality -> spanish (pre-refactor API path)', async () => {
      const out = await generateIntelligentResponse('translate quality to spanish', [], userProfile as any)
      // Expect a proper spanish word different from the source
      expect(out.toLowerCase()).not.toContain('quality')
    })
  })

  describe('Recommendations & comparisons', () => {
    it('recommends for manufacturing / shop floor QA (audience-based)', async () => {
      const decision = decideToolCall('which tool is best for shop floor QA', toolsCatalog as any)
      expect(decision?.toolName).toBe('recommendTool')
      const result = await executeTool(decision!.toolName, decision!.toolInput, toolsCatalog as any, userProfile as any)
      expect(result.ok).toBe(true)
      expect((result as any).data.length).toBeGreaterThan(0)
    })

    it('recommends for R&D (audience-based)', async () => {
      const decision = decideToolCall('recommend a tool for R&D users', toolsCatalog as any)
      expect(decision?.toolName).toBe('recommendTool')
      const result = await executeTool(decision!.toolName, decision!.toolInput, toolsCatalog as any, userProfile as any)
      expect(result.ok).toBe(true)
      expect((result as any).data.length).toBeGreaterThan(0)
    })

    it('compares named tools', async () => {
      const decision = decideToolCall('compare Concierge vs ChatGPT', toolsCatalog as any)
      expect(decision?.toolName).toBe('compareTools')
      const result = await executeTool('compareTools', decision!.toolInput, toolsCatalog as any, userProfile as any)
      expect(result.ok).toBe(true)
      const names = ((result as any).data as any[]).map(t => t.name)
      expect(names).toContain('Concierge')
      expect(names).toContain('ChatGPT')
    })
  })

  describe('Knowledge routing', () => {
    it('answers Sanofi info from knowledge base', async () => {
      const out = await generateIntelligentResponse('tell me about Sanofi', [], userProfile as any)
      expect(out).toMatch(/About Sanofi|Latest Sanofi/i)
    })

    it('explains AI Compass comparison feature', async () => {
      const out = await generateIntelligentResponse('how does AI Compass comparison work?', [], userProfile as any)
      expect(out).toContain('Tool Comparison Feature')
    })
  })
})
