import {renderHook} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'

import {useToggleTitles} from '../../hooks/useToggleTitles'

describe('useToggleTitles', () => {
  const createMockPatch = () => ({
    execute: vi.fn(),
  })

  it('returns toggleColumnTitles and toggleRowTitles functions', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() => useToggleTitles(true, true, mockPatch as never, 'myTable'))

    expect(result.current.toggleColumnTitles).toBeDefined()
    expect(typeof result.current.toggleColumnTitles).toBe('function')
    expect(result.current.toggleRowTitles).toBeDefined()
    expect(typeof result.current.toggleRowTitles).toBe('function')
  })

  describe('toggleColumnTitles', () => {
    it('calls patch.execute with set operation when enabling', () => {
      const mockPatch = createMockPatch()
      const {result} = renderHook(() =>
        useToggleTitles(false, false, mockPatch as never, 'myTable'),
      )

      result.current.toggleColumnTitles(true)

      expect(mockPatch.execute).toHaveBeenCalledWith([{set: {'myTable.hasColumnTitles': true}}])
    })

    it('calls patch.execute with unset operation when disabling', () => {
      const mockPatch = createMockPatch()
      const {result} = renderHook(() => useToggleTitles(true, false, mockPatch as never, 'myTable'))

      result.current.toggleColumnTitles(false)

      expect(mockPatch.execute).toHaveBeenCalledWith([{unset: ['myTable.hasColumnTitles']}])
    })

    it('uses correct path for nested tables', () => {
      const mockPatch = createMockPatch()
      const {result} = renderHook(() =>
        useToggleTitles(false, false, mockPatch as never, 'content.tables[0]'),
      )

      result.current.toggleColumnTitles(true)

      expect(mockPatch.execute).toHaveBeenCalledWith([
        {set: {'content.tables[0].hasColumnTitles': true}},
      ])
    })
  })

  describe('toggleRowTitles', () => {
    it('calls patch.execute with set operation when enabling', () => {
      const mockPatch = createMockPatch()
      const {result} = renderHook(() =>
        useToggleTitles(false, false, mockPatch as never, 'myTable'),
      )

      result.current.toggleRowTitles(true)

      expect(mockPatch.execute).toHaveBeenCalledWith([{set: {'myTable.hasRowTitles': true}}])
    })

    it('calls patch.execute with unset operation when disabling', () => {
      const mockPatch = createMockPatch()
      const {result} = renderHook(() => useToggleTitles(false, true, mockPatch as never, 'myTable'))

      result.current.toggleRowTitles(false)

      expect(mockPatch.execute).toHaveBeenCalledWith([{unset: ['myTable.hasRowTitles']}])
    })

    it('uses correct path for nested tables', () => {
      const mockPatch = createMockPatch()
      const {result} = renderHook(() =>
        useToggleTitles(false, false, mockPatch as never, 'document.data.table'),
      )

      result.current.toggleRowTitles(true)

      expect(mockPatch.execute).toHaveBeenCalledWith([
        {set: {'document.data.table.hasRowTitles': true}},
      ])
    })
  })

  it('memoizes callbacks correctly', () => {
    const mockPatch = createMockPatch()
    const {result, rerender} = renderHook(
      ({path}) => useToggleTitles(false, false, mockPatch as never, path),
      {initialProps: {path: 'myTable'}},
    )

    const firstToggleColumn = result.current.toggleColumnTitles
    const firstToggleRow = result.current.toggleRowTitles

    // Rerender with same props
    rerender({path: 'myTable'})

    expect(result.current.toggleColumnTitles).toBe(firstToggleColumn)
    expect(result.current.toggleRowTitles).toBe(firstToggleRow)

    // Rerender with different path
    rerender({path: 'differentTable'})

    expect(result.current.toggleColumnTitles).not.toBe(firstToggleColumn)
    expect(result.current.toggleRowTitles).not.toBe(firstToggleRow)
  })
})
