import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

import renderDecorator from '../../../portable-text/configs/renderer/renderDecorators'

describe('renderDecorator', () => {
  it('is a function', () => {
    expect(typeof renderDecorator).toBe('function')
  })

  describe('strong decorator', () => {
    it('renders strong tag', () => {
      const props = {value: 'strong', children: 'Bold text'}
      const result = renderDecorator(props as never)
      render(result)

      const element = screen.getByText('Bold text')
      expect(element.tagName).toBe('STRONG')
    })
  })

  describe('em decorator', () => {
    it('renders em tag', () => {
      const props = {value: 'em', children: 'Italic text'}
      const result = renderDecorator(props as never)
      render(result)

      const element = screen.getByText('Italic text')
      expect(element.tagName).toBe('EM')
    })
  })

  describe('underline decorator', () => {
    it('renders u tag', () => {
      const props = {value: 'underline', children: 'Underlined text'}
      const result = renderDecorator(props as never)
      render(result)

      const element = screen.getByText('Underlined text')
      expect(element.tagName).toBe('U')
    })
  })

  describe('code decorator', () => {
    it('renders code tag', () => {
      const props = {value: 'code', children: 'Code text'}
      const result = renderDecorator(props as never)
      render(result)

      const element = screen.getByText('Code text')
      expect(element.tagName).toBe('CODE')
    })

    it('applies correct styles to code', () => {
      const props = {value: 'code', children: 'Code text'}
      const result = renderDecorator(props as never)
      render(result)

      const element = screen.getByText('Code text')
      expect(element).toHaveStyle({borderRadius: '1px'})
    })

    it('has aria-label for accessibility', () => {
      const props = {value: 'code', children: 'myFunction'}
      const result = renderDecorator(props as never)
      render(result)

      const element = screen.getByLabelText('Code: myFunction')
      expect(element).toBeInTheDocument()
    })
  })

  describe('strike-through decorator', () => {
    it('renders s tag', () => {
      const props = {value: 'strike-through', children: 'Strikethrough text'}
      const result = renderDecorator(props as never)
      render(result)

      const element = screen.getByText('Strikethrough text')
      expect(element.tagName).toBe('S')
    })
  })

  describe('unknown decorator', () => {
    it('renders children without wrapper for unknown decorators', () => {
      const props = {value: 'unknown', children: 'Plain text'}
      const result = renderDecorator(props as never)
      render(result)

      expect(screen.getByText('Plain text')).toBeInTheDocument()
    })
  })
})
