import {describe, expect, it} from 'vitest'

import {extendAnnotation} from '../../../portable-text/configs/extendAnnotation'

describe('extendAnnotation', () => {
  it('is a function', () => {
    expect(typeof extendAnnotation).toBe('function')
  })
})

describe('extendAnnotation link', () => {
  it('extends link annotation with icon', () => {
    const input = {name: 'link', title: 'Link', fields: []} as const
    const result = extendAnnotation(input)

    expect(result.icon).toBeDefined()
  })

  it('extends link annotation with default values', () => {
    const input = {name: 'link', title: 'Link', fields: []} as const
    const result = extendAnnotation(input)

    expect(result.defaultValues).toBeDefined()
    expect(result.defaultValues?.href).toBe('https://example.com')
  })

  it('extends link annotation with shortcut', () => {
    const input = {name: 'link', title: 'Link', fields: []} as const
    const result = extendAnnotation(input)

    expect(result.shortcut).toBeDefined()
  })

  it('preserves original properties', () => {
    const input = {name: 'link', title: 'Link', fields: []} as const
    const result = extendAnnotation(input)

    expect(result.title).toBe('Link')
  })
})

describe('extendAnnotation unknown', () => {
  it('returns original annotation for unknown annotation names', () => {
    const input = {name: 'custom-annotation', title: 'Custom', fields: []} as const
    const result = extendAnnotation(input)

    expect(result.name).toBe('custom-annotation')
    expect(result.title).toBe('Custom')
  })

  it('does not add icon to unknown annotations', () => {
    const input = {name: 'unknown', title: 'Unknown Annotation', fields: []} as const
    const result = extendAnnotation(input)

    expect(result.icon).toBeUndefined()
  })

  it('does not add defaultValues to unknown annotations', () => {
    const input = {name: 'unknown', title: 'Unknown Annotation', fields: []} as const
    const result = extendAnnotation(input)

    expect(result.defaultValues).toBeUndefined()
  })

  it('does not add shortcut to unknown annotations', () => {
    const input = {name: 'unknown', title: 'Unknown Annotation', fields: []} as const
    const result = extendAnnotation(input)

    expect(result.shortcut).toBeUndefined()
  })
})
