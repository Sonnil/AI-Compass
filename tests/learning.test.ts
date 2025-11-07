import { describe, it, expect, beforeEach } from 'vitest'
import { storeFeedback, getLearningInsights } from '../src/features/sona/learning.js'

function clearStorage() {
  try {
    localStorage.clear()
  } catch {}
}

describe('learning feedback', () => {
  beforeEach(() => clearStorage())

  it('stores feedback and updates insights', () => {
    storeFeedback('recommend a tool for writing', 'Use ChatGPT', 'positive')
    storeFeedback('compare tools', 'Compared A vs B', 'negative')
    const insights = getLearningInsights()
    expect(insights.totalFeedback).toBe(2)
    expect(insights.accuracy).toBeGreaterThanOrEqual(0)
    expect(Array.isArray(insights.topSuccessPatterns)).toBe(true)
  })
})
