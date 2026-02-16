import {describe, expect, it} from 'vitest'

import {extendList} from '../../../portable-text/configs/extendList'

describe('extendList', () => {
  it('is a function', () => {
    expect(typeof extendList).toBe('function')
  })
})

describe('extendList bullet', () => {
  it('extends bullet list with icon', () => {
    const input = {name: 'bullet', value: 'bullet', title: 'Bullet List'} as const
    const result = extendList(input)

    expect(result.icon).toBeDefined()
    expect(result.name).toBe('bullet')
  })

  it('preserves original properties', () => {
    const input = {name: 'bullet', value: 'bullet', title: 'Bullet List'} as const
    const result = extendList(input)

    expect(result.title).toBe('Bullet List')
  })
})

describe('extendList number', () => {
  it('extends number list with icon', () => {
    const input = {name: 'number', value: 'number', title: 'Numbered List'} as const
    const result = extendList(input)

    expect(result.icon).toBeDefined()
    expect(result.name).toBe('number')
  })

  it('preserves original properties', () => {
    const input = {name: 'number', value: 'number', title: 'Numbered List'} as const
    const result = extendList(input)

    expect(result.title).toBe('Numbered List')
  })
})

describe('extendList unknown', () => {
  it('returns original list for unknown list names', () => {
    const input = {name: 'custom-list', value: 'custom-list', title: 'Custom'} as const
    const result = extendList(input)

    expect(result.name).toBe('custom-list')
    expect(result.title).toBe('Custom')
  })

  it('does not add icon to unknown lists', () => {
    const input = {name: 'unknown', value: 'unknown', title: 'Unknown List'} as const
    const result = extendList(input)

    expect(result.icon).toBeUndefined()
  })
})
