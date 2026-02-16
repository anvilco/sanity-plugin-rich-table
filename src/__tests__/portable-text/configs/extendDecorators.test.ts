import {describe, expect, it} from 'vitest'

import extendDecorator from '../../../portable-text/configs/extendDecorators'

describe('extendDecorator', () => {
  it('is a function', () => {
    expect(typeof extendDecorator).toBe('function')
  })
})

describe('extendDecorator strong', () => {
  it('extends strong decorator with title, icon, and shortcut', () => {
    const input = {name: 'strong', value: 'strong'} as const
    const result = extendDecorator(input)

    expect(result.title).toBe('Bold')
    expect(result.icon).toBeDefined()
    expect(result.shortcut).toBeDefined()
  })
})

describe('extendDecorator em', () => {
  it('extends em decorator with title, icon, and shortcut', () => {
    const input = {name: 'em', value: 'em'} as const
    const result = extendDecorator(input)

    expect(result.title).toBe('Italic')
    expect(result.icon).toBeDefined()
    expect(result.shortcut).toBeDefined()
  })
})

describe('extendDecorator code', () => {
  it('extends code decorator with title, icon, and shortcut', () => {
    const input = {name: 'code', value: 'code'} as const
    const result = extendDecorator(input)

    expect(result.title).toBe('Inline Code')
    expect(result.icon).toBeDefined()
    expect(result.shortcut).toBeDefined()
  })
})

describe('extendDecorator underline', () => {
  it('extends underline decorator with title, icon, and shortcut', () => {
    const input = {name: 'underline', value: 'underline'} as const
    const result = extendDecorator(input)

    expect(result.title).toBe('Underline')
    expect(result.icon).toBeDefined()
    expect(result.shortcut).toBeDefined()
  })
})

describe('extendDecorator strike-through', () => {
  it('extends strike-through decorator with title, icon, and shortcut', () => {
    const input = {name: 'strike-through', value: 'strike-through'} as const
    const result = extendDecorator(input)

    expect(result.title).toBe('Strikethrough')
    expect(result.icon).toBeDefined()
    expect(result.shortcut).toBeDefined()
  })
})

describe('extendDecorator unknown', () => {
  it('returns original decorator for unknown decorator names', () => {
    const input = {name: 'custom-decorator', value: 'custom-decorator'} as const
    const result = extendDecorator(input)

    expect(result.name).toBe('custom-decorator')
    expect(result.value).toBe('custom-decorator')
  })
})
