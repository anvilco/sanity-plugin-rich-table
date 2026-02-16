import {describe, expect, it} from 'vitest'

import {extendBlockObject} from '../../../portable-text/configs/extendBlockObject'

describe('extendBlockObject', () => {
  it('is a function', () => {
    expect(typeof extendBlockObject).toBe('function')
  })

  it('returns the original block object unchanged for unknown types', () => {
    const input = {
      name: 'customBlock',
      title: 'Custom Block',
      fields: [] as const,
    }
    const result = extendBlockObject(input)

    expect(result.name).toBe('customBlock')
    expect(result.title).toBe('Custom Block')
  })

  it('preserves name and title of the block object', () => {
    const input = {
      name: 'someBlock',
      title: 'Some Block',
      fields: [] as const,
    }
    const result = extendBlockObject(input)

    expect(result.name).toBe('someBlock')
    expect(result.title).toBe('Some Block')
  })

  it('handles block objects with empty fields array', () => {
    const input = {
      name: 'emptyBlock',
      title: 'Empty Block',
      fields: [] as const,
    }
    const result = extendBlockObject(input)

    expect(result.fields).toEqual([])
  })
})
