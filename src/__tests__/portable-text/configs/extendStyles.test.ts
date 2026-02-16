import {describe, expect, it} from 'vitest'

import extendStyle from '../../../portable-text/configs/extendStyles'

describe('extendStyle', () => {
  it('is a function', () => {
    expect(typeof extendStyle).toBe('function')
  })
})

describe('extendStyle normal', () => {
  it('extends normal style with title and icon', () => {
    const input = {name: 'normal', value: 'normal', title: 'Normal Text'} as const
    const result = extendStyle(input)

    expect(result.title).toBe('Normal')
    expect(result.icon).toBeDefined()
  })
})

describe('extendStyle headings', () => {
  it('extends h1 style', () => {
    const input = {name: 'h1', value: 'h1', title: 'H1'} as const
    const result = extendStyle(input)

    expect(result.title).toBe('Heading 1')
    expect(result.icon).toBeDefined()
  })

  it('extends h2 style', () => {
    const input = {name: 'h2', value: 'h2', title: 'H2'} as const
    const result = extendStyle(input)

    expect(result.title).toBe('Heading 2')
    expect(result.icon).toBeDefined()
  })

  it('extends h3 style', () => {
    const input = {name: 'h3', value: 'h3', title: 'H3'} as const
    const result = extendStyle(input)

    expect(result.title).toBe('Heading 3')
    expect(result.icon).toBeDefined()
  })

  it('extends h4 style', () => {
    const input = {name: 'h4', value: 'h4', title: 'H4'} as const
    const result = extendStyle(input)

    expect(result.title).toBe('Heading 4')
    expect(result.icon).toBeDefined()
  })

  it('extends h5 style', () => {
    const input = {name: 'h5', value: 'h5', title: 'H5'} as const
    const result = extendStyle(input)

    expect(result.title).toBe('Heading 5')
    expect(result.icon).toBeDefined()
  })

  it('extends h6 style', () => {
    const input = {name: 'h6', value: 'h6', title: 'H6'} as const
    const result = extendStyle(input)

    expect(result.title).toBe('Heading 6')
    expect(result.icon).toBeDefined()
  })
})

describe('extendStyle blockquote', () => {
  it('extends blockquote style', () => {
    const input = {name: 'blockquote', value: 'blockquote', title: 'Blockquote'} as const
    const result = extendStyle(input)

    expect(result.title).toBe('Quote')
    expect(result.icon).toBeDefined()
  })
})

describe('extendStyle unknown', () => {
  it('returns original style for unknown style names', () => {
    const input = {name: 'custom-style', value: 'custom-style', title: 'Custom'} as const
    const result = extendStyle(input)

    expect(result.name).toBe('custom-style')
    expect(result.title).toBe('Custom')
  })
})
