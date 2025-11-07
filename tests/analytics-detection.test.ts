import { describe, it, expect } from 'vitest'
import { generateIntelligentResponse } from '../src/features/sona/responses'
import type { UserProfile } from '../src/features/sona/types'

describe('Analytics Detection - All Variations', () => {
  const mockProfile: UserProfile = {
    name: 'Test User',
    interests: [],
    commonQueries: [],
    toolsAskedAbout: [],
    conversationStyle: 'casual'
  }

  const analyticsQueries = [
    'can you do analytics',
    'can you do data analytics',
    'tell me about analytics',
    'tell about the analytics',
    'show analytics',
    'what is analytics',
    'explain analytics dashboard'
  ]

  analyticsQueries.forEach(query => {
    it(`should return Analytics Dashboard insights for: "${query}"`, async () => {
      console.log(`\n🤖 Testing: ${query}`)
      const response = await generateIntelligentResponse(query, [], mockProfile)
      
      // Should contain Analytics Dashboard content
      expect(response).toMatch(/Analytics Dashboard/i)
      
      // Should NOT be a tool recommendation
      expect(response).not.toContain('Great question! Here are the tools I recommend:')
      expect(response).not.toContain('**Plai**')
      
      // Should contain actual insights
      expect(response).toMatch(/Tool Distribution|Feature Coverage|capability|insights/i)
      
      console.log(`✅ Correctly routed to Analytics Dashboard\n`)
    })
  })

  it('should still recommend tools for "tool for data analytics"', async () => {
    const response = await generateIntelligentResponse(
      'tool for data analytics',
      [],
      mockProfile
    )
    
    // This should trigger tool recommendations (not Analytics Dashboard)
    // Since the query contains "tool" and "analytics", the first check excludes it
    expect(response).not.toMatch(/Analytics Dashboard - Key Insights/)
  })
})
