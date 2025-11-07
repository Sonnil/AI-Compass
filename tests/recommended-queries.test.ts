import { describe, it, expect } from 'vitest'
import { generateIntelligentResponse } from '../src/features/sona/responses.js'

const userProfile = { name: 'Tester', interests: [], commonQueries: [], toolsAskedAbout: [], conversationStyle: 'casual' }

describe('Recommended queries and suggestions', () => {
  describe('Translation capability examples', () => {
    it('translate bonjour to english', async () => {
      const out = await generateIntelligentResponse('translate bonjour to english', [], userProfile as any)
      expect(out.toLowerCase()).toContain('hello')
    })

    it('how do you say quality in spanish', async () => {
      const out = await generateIntelligentResponse('how do you say quality in spanish', [], userProfile as any)
      // Should attempt translation (API or guidance)
      expect(out.length).toBeGreaterThan(0)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
    })

    it('translate hello into french', async () => {
      const out = await generateIntelligentResponse('translate hello into french', [], userProfile as any)
      expect(out.toLowerCase()).toContain('bonjour')
    })
  })

  describe('Tool recommendation examples from fallback', () => {
    it('What\'s a good tool for productivity?', async () => {
      const out = await generateIntelligentResponse('What\'s a good tool for productivity?', [], userProfile as any)
      // Should trigger recommendation or ask for clarification, not fallback
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })

    it('Find me a tool for data analysis', async () => {
      const out = await generateIntelligentResponse('Find me a tool for data analysis', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })
  })

  describe('Comparison examples from fallback', () => {
    it('Compare Concierge and ChatGPT', async () => {
      const out = await generateIntelligentResponse('Compare Concierge and ChatGPT', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })

    it('What\'s the difference between Newton and MedIS?', async () => {
      const out = await generateIntelligentResponse('What\'s the difference between Newton and MedIS?', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })
  })

  describe('Knowledge examples from fallback', () => {
    it('Tell me about Sanofi', async () => {
      const out = await generateIntelligentResponse('Tell me about Sanofi', [], userProfile as any)
      expect(out).toMatch(/About Sanofi|Latest Sanofi/i)
    })

    it('What features does AI Compass have?', async () => {
      const out = await generateIntelligentResponse('What features does AI Compass have?', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out).toMatch(/AI Compass|feature|search|filter|comparison/i)
    })

    it('Tell me a joke!', async () => {
      const out = await generateIntelligentResponse('Tell me a joke!', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })
  })

  describe('Analytics Dashboard action examples', () => {
    it('View tool distribution by type (internal vs external)', async () => {
      const out = await generateIntelligentResponse('View tool distribution by type (internal vs external)', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out).toMatch(/Analytics|dashboard|distribution|tool/i)
    })

    it('Analyze feature coverage across all tools', async () => {
      const out = await generateIntelligentResponse('Analyze feature coverage across all tools', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out).toMatch(/Analytics|dashboard|feature|coverage/i)
    })

    it('Understand capability matrix', async () => {
      const out = await generateIntelligentResponse('Understand capability matrix', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })

    it('Identify gaps in the tool catalog', async () => {
      const out = await generateIntelligentResponse('Identify gaps in the tool catalog', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })

    it('Make data-driven decisions about tool adoption', async () => {
      const out = await generateIntelligentResponse('Make data-driven decisions about tool adoption', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })
  })

  describe('Greeting capability examples', () => {
    it('Find the perfect AI tool for your needs', async () => {
      const out = await generateIntelligentResponse('Find the perfect AI tool for your needs', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })

    it('Compare different tools', async () => {
      const out = await generateIntelligentResponse('Compare different tools', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })

    it('Learn about Sanofi and AI Compass', async () => {
      const out = await generateIntelligentResponse('Learn about Sanofi and AI Compass', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })
  })

  describe('Acknowledgment follow-up examples', () => {
    it('What tool is good for [purpose]?', async () => {
      const out = await generateIntelligentResponse('What tool is good for productivity?', [], userProfile as any)
      expect(out).not.toMatch(/not quite sure what you're asking/i)
      expect(out.length).toBeGreaterThan(0)
    })

    it('Parlez-moi de Sanofi (French)', async () => {
      const out = await generateIntelligentResponse('Parlez-moi de Sanofi', [], userProfile as any)
      // Should either handle or not crash
      expect(out.length).toBeGreaterThan(0)
    })
  })
})
