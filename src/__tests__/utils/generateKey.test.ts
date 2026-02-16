import {describe, expect, it} from 'vitest'

import {generateKey} from '../../utils/generateKey'

describe('generateKey', () => {
  it('generates a key with default length of 16', () => {
    const key = generateKey()
    expect(key).toHaveLength(16)
  })

  it('generates a key with custom length', () => {
    const key = generateKey(8)
    expect(key).toHaveLength(8)
  })

  it('generates a key with only lowercase letters and numbers', () => {
    const key = generateKey(100)
    expect(key).toMatch(/^[a-z0-9]+$/)
  })

  it('generates unique keys', () => {
    const keys = new Set<string>()
    for (let i = 0; i < 100; i++) {
      keys.add(generateKey())
    }
    // All 100 keys should be unique
    expect(keys.size).toBe(100)
  })

  it('generates keys with length 1', () => {
    const key = generateKey(1)
    expect(key).toHaveLength(1)
    expect(key).toMatch(/^[a-z0-9]$/)
  })
})
