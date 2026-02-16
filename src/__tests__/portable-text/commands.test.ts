import {describe, expect, it} from 'vitest'

import {CommandMatch, slashCommands} from '../../portable-text/pte-slash-commands/commands'

describe('slashCommands', () => {
  it('exports an array of commands', () => {
    expect(Array.isArray(slashCommands)).toBe(true)
    expect(slashCommands.length).toBeGreaterThan(0)
  })

  it('all commands have required properties', () => {
    slashCommands.forEach((command: CommandMatch) => {
      expect(command.key).toBeDefined()
      expect(typeof command.key).toBe('string')
      expect(command.label).toBeDefined()
      expect(typeof command.label).toBe('string')
      expect(command.description).toBeDefined()
      expect(typeof command.description).toBe('string')
      expect(command.icon).toBeDefined()
      expect(command.keywords).toBeDefined()
      expect(Array.isArray(command.keywords)).toBe(true)
      expect(command.action).toBeDefined()
      expect(command.action.type).toBeDefined()
    })
  })

  it('all commands have unique keys', () => {
    const keys = slashCommands.map((c) => c.key)
    const uniqueKeys = new Set(keys)
    expect(uniqueKeys.size).toBe(keys.length)
  })
})

describe('style commands', () => {
  const styleCommands = slashCommands.filter((c) => c.action.type === 'style.toggle')

  it('includes normal text command', () => {
    const normalCommand = styleCommands.find((c) => c.key === 'normal')
    expect(normalCommand).toBeDefined()
    expect(normalCommand?.action).toEqual({type: 'style.toggle', style: 'normal'})
  })

  it('includes heading commands h1-h5', () => {
    const headingKeys = ['h1', 'h2', 'h3', 'h4', 'h5']
    for (const key of headingKeys) {
      const headingCommand = styleCommands.find((c) => c.key === key)
      expect(headingCommand).toBeDefined()
      expect(headingCommand?.action).toEqual({type: 'style.toggle', style: key})
    }
  })

  it('includes quote command', () => {
    const quoteCommand = styleCommands.find((c) => c.key === 'quote')
    expect(quoteCommand).toBeDefined()
    expect(quoteCommand?.action).toEqual({type: 'style.toggle', style: 'blockquote'})
  })
})

describe('list item commands', () => {
  const listCommands = slashCommands.filter((c) => c.action.type === 'list item.toggle')

  it('includes bullet list command', () => {
    const bulletCommand = listCommands.find((c) => c.key === 'bullet')
    expect(bulletCommand).toBeDefined()
    if (bulletCommand?.action.type === 'list item.toggle') {
      expect(bulletCommand.action.listItem).toBe('bullet')
    }
  })

  it('includes numbered list command', () => {
    const numberCommand = listCommands.find((c) => c.key === 'number')
    expect(numberCommand).toBeDefined()
    if (numberCommand?.action.type === 'list item.toggle') {
      expect(numberCommand.action.listItem).toBe('number')
    }
  })
})

describe('command keywords', () => {
  it('heading commands include "heading" keyword', () => {
    const headingCommands = slashCommands.filter((c) => c.key.startsWith('h'))
    for (const command of headingCommands) {
      expect(command.keywords).toContain('heading')
    }
  })

  it('list commands include "list" keyword', () => {
    const listCommands = slashCommands.filter((c) => c.key === 'bullet' || c.key === 'number')
    for (const command of listCommands) {
      expect(command.keywords).toContain('list')
    }
  })

  it('quote command includes relevant keywords', () => {
    const quoteCommand = slashCommands.find((c) => c.key === 'quote')
    expect(quoteCommand?.keywords).toContain('quote')
    expect(quoteCommand?.keywords).toContain('blockquote')
  })
})

describe('command descriptions', () => {
  it('all descriptions are non-empty strings', () => {
    for (const command of slashCommands) {
      expect(command.description.length).toBeGreaterThan(0)
    }
  })
})

describe('command labels', () => {
  it('all labels are non-empty strings', () => {
    for (const command of slashCommands) {
      expect(command.label.length).toBeGreaterThan(0)
    }
  })

  it('heading labels follow pattern', () => {
    const headingKeys = ['h1', 'h2', 'h3', 'h4', 'h5']
    const headingCommands = slashCommands.filter((c) => headingKeys.includes(c.key))
    for (const command of headingCommands) {
      expect(command.label).toMatch(/^Heading \d$/)
    }
  })
})
