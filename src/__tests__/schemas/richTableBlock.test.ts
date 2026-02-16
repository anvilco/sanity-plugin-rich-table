import {describe, expect, it} from 'vitest'

import richTableBlock from '../../schemas/richTable.block'

describe('richTableBlock schema', () => {
  it('has correct name', () => {
    expect(richTableBlock.name).toBe('richTableBlock')
  })

  it('has correct title', () => {
    expect(richTableBlock.title).toBe('Rich Table Block')
  })

  it('extends richTable type', () => {
    expect(richTableBlock.type).toBe('richTable')
  })

  it('has block component defined', () => {
    expect(richTableBlock.components?.block).toBeDefined()
  })

  it('has input component defined', () => {
    expect(richTableBlock.components?.input).toBeDefined()
  })
})
