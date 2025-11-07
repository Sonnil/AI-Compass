import { describe, it, expect } from 'vitest'
import { generateIntelligentResponse } from '../src/features/sona/responses'
import type { UserProfile } from '../src/features/sona/types'

describe('Analytics Insights', () => {
  const mockProfile: UserProfile = {
    name: 'Test User',
    interests: [],
    commonQueries: [],
    toolsAskedAbout: [],
    conversationStyle: 'casual'
  }

  it('should provide detailed insights for "can you do analytics"', async () => {
    console.log('🤖 SONA: Generating response for query: can you do analytics')
    const response = await generateIntelligentResponse(
      'can you do analytics',
      [],
      mockProfile
    )
    
    console.log('\n===== RESPONSE =====')
    console.log(response)
    console.log('====================\n')
    
    expect(response).toContain('Analytics Dashboard')
    expect(response).not.toContain('Click the 📊 Analytics button in the header!')
    expect(response.length).toBeGreaterThan(200)
  })

  it('should provide tool distribution insights for "View tool distribution"', async () => {
    console.log('🤖 SONA: Generating response for query: View tool distribution by type')
    const response = await generateIntelligentResponse(
      'View tool distribution by type',
      [],
      mockProfile
    )
    
    console.log('\n===== RESPONSE =====')
    console.log(response)
    console.log('====================\n')
    
    expect(response).toContain('Breakdown of tools')
    expect(response).toContain('internal Sanofi tools vs external')
    expect(response).not.toContain('Click the 📊 Analytics button in the header!')
  })

  it('should provide feature coverage insights for "Analyze feature coverage"', async () => {
    console.log('🤖 SONA: Generating response for query: Analyze feature coverage across all tools')
    const response = await generateIntelligentResponse(
      'Analyze feature coverage across all tools',
      [],
      mockProfile
    )
    
    console.log('\n===== RESPONSE =====')
    console.log(response)
    console.log('====================\n')
    
    expect(response).toMatch(/capability|capabilities/i)
    expect(response).toContain('Identify capability gaps')
    expect(response).not.toContain('Click the 📊 Analytics button in the header!')
  })

  it('should provide capability matrix insights for "Understand capability matrix"', async () => {
    console.log('🤖 SONA: Generating response for query: Understand capability matrix')
    const response = await generateIntelligentResponse(
      'Understand capability matrix (which tools have what features)',
      [],
      mockProfile
    )
    
    console.log('\n===== RESPONSE =====')
    console.log(response)
    console.log('====================\n')
    
    expect(response).toContain('capability')
    expect(response).not.toContain('Click the 📊 Analytics button')
  })
})
