import type {KeyboardEvent} from 'react'
import {describe, expect, it, vi} from 'vitest'

import {onKeyDownSelectCells} from '../../utils/onKeyDownSelect'

function createKeyboardEvent(key: string): KeyboardEvent<HTMLDivElement> {
  return {
    key,
    preventDefault: vi.fn(),
  } as unknown as KeyboardEvent<HTMLDivElement>
}

describe('onKeyDownSelectCells', () => {
  it('moves selection up on ArrowUp', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('ArrowUp')

    onKeyDownSelectCells({
      e,
      selected: {rows: 2, cols: 2},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(setSelected).toHaveBeenCalledWith({rows: 1, cols: 2})
    expect(e.preventDefault).toHaveBeenCalled()
  })

  it('does not go below 0 rows on ArrowUp', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('ArrowUp')

    onKeyDownSelectCells({
      e,
      selected: {rows: 0, cols: 2},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(setSelected).toHaveBeenCalledWith({rows: 0, cols: 2})
  })

  it('moves selection down on ArrowDown', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('ArrowDown')

    onKeyDownSelectCells({
      e,
      selected: {rows: 2, cols: 2},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(setSelected).toHaveBeenCalledWith({rows: 3, cols: 2})
    expect(e.preventDefault).toHaveBeenCalled()
  })

  it('does not exceed maxRows on ArrowDown', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('ArrowDown')

    onKeyDownSelectCells({
      e,
      selected: {rows: 5, cols: 2},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(setSelected).toHaveBeenCalledWith({rows: 5, cols: 2})
  })

  it('moves selection left on ArrowLeft', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('ArrowLeft')

    onKeyDownSelectCells({
      e,
      selected: {rows: 2, cols: 2},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(setSelected).toHaveBeenCalledWith({rows: 2, cols: 1})
    expect(e.preventDefault).toHaveBeenCalled()
  })

  it('does not go below 0 cols on ArrowLeft', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('ArrowLeft')

    onKeyDownSelectCells({
      e,
      selected: {rows: 2, cols: 0},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(setSelected).toHaveBeenCalledWith({rows: 2, cols: 0})
  })

  it('moves selection right on ArrowRight', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('ArrowRight')

    onKeyDownSelectCells({
      e,
      selected: {rows: 2, cols: 2},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(setSelected).toHaveBeenCalledWith({rows: 2, cols: 3})
    expect(e.preventDefault).toHaveBeenCalled()
  })

  it('does not exceed maxCols on ArrowRight', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('ArrowRight')

    onKeyDownSelectCells({
      e,
      selected: {rows: 2, cols: 5},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(setSelected).toHaveBeenCalledWith({rows: 2, cols: 5})
  })

  it('calls onChange on Enter when selection is valid', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('Enter')

    onKeyDownSelectCells({
      e,
      selected: {rows: 2, cols: 3},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(onChange).toHaveBeenCalled()
    expect(e.preventDefault).toHaveBeenCalled()
  })

  it('does not call onChange on Enter when rows is 0', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('Enter')

    onKeyDownSelectCells({
      e,
      selected: {rows: 0, cols: 3},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(onChange).not.toHaveBeenCalled()
    expect(e.preventDefault).toHaveBeenCalled()
  })

  it('does not call onChange on Enter when cols is 0', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('Enter')

    onKeyDownSelectCells({
      e,
      selected: {rows: 3, cols: 0},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(onChange).not.toHaveBeenCalled()
    expect(e.preventDefault).toHaveBeenCalled()
  })

  it('ignores other keys', () => {
    const setSelected = vi.fn()
    const onChange = vi.fn()
    const e = createKeyboardEvent('a')

    onKeyDownSelectCells({
      e,
      selected: {rows: 2, cols: 2},
      setSelected,
      maxRows: 5,
      maxCols: 5,
      onChange,
    })

    expect(setSelected).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
    expect(e.preventDefault).not.toHaveBeenCalled()
  })
})
