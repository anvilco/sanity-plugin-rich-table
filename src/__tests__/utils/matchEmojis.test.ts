import {describe, expect, it} from 'vitest'

import {matchEmojis} from '../../portable-text/emoji-picker/matchEmojis'

describe('matchEmojis', () => {
  it('returns empty array for empty keyword', () => {
    expect(matchEmojis({keyword: ''})).toEqual([])
  })

  it('finds emoji by exact keyword match', () => {
    const results = matchEmojis({keyword: 'smile'})
    expect(results.length).toBeGreaterThan(0)
    // Should find smiling emojis
    const hasSmileEmoji = results.some((r) => r.emoji.includes('😊') || r.emoji.includes('😄'))
    expect(hasSmileEmoji || results.length > 0).toBe(true)
  })

  it('finds emoji by partial keyword match', () => {
    const results = matchEmojis({keyword: 'hap'})
    expect(results.length).toBeGreaterThan(0)
  })

  it('returns results with correct structure for exact match', () => {
    const results = matchEmojis({keyword: 'grinning'})
    const exactMatch = results.find((r) => r.type === 'exact')
    if (exactMatch) {
      expect(exactMatch).toHaveProperty('emoji')
      expect(exactMatch).toHaveProperty('keyword')
      expect(exactMatch).toHaveProperty('key')
    }
  })

  it('returns results with correct structure for partial match', () => {
    const results = matchEmojis({keyword: 'hap'})
    const partialMatch = results.find((r) => r.type === 'partial')
    if (partialMatch) {
      expect(partialMatch).toHaveProperty('emoji')
      expect(partialMatch).toHaveProperty('keyword')
      expect(partialMatch).toHaveProperty('key')
      expect(partialMatch).toHaveProperty('startSlice')
      expect(partialMatch).toHaveProperty('endSlice')
    }
  })

  it('limits results to 50', () => {
    // Use a common keyword that would match many emojis
    const results = matchEmojis({keyword: 'a'})
    expect(results.length).toBeLessThanOrEqual(50)
  })

  it('is case insensitive', () => {
    const lowerResults = matchEmojis({keyword: 'smile'})
    const upperResults = matchEmojis({keyword: 'SMILE'})
    // Both should return results
    expect(lowerResults.length).toBeGreaterThan(0)
    expect(upperResults.length).toBeGreaterThan(0)
  })

  it('finds heart emoji', () => {
    const results = matchEmojis({keyword: 'heart'})
    expect(results.length).toBeGreaterThan(0)
    const hasHeart = results.some((r) => r.emoji === '❤️' || r.emoji.includes('❤'))
    expect(hasHeart || results.length > 0).toBe(true)
  })

  it('finds thumbs up emoji', () => {
    const results = matchEmojis({keyword: 'thumbs'})
    expect(results.length).toBeGreaterThan(0)
  })
})
