import {renderHook} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'

import {useToggleHeadersInFirstColumn} from '../../hooks/useToggleHeadersInFirstColumn'

describe('useToggleHeadersInFirstColumn', () => {
  const createMockPatch = () => ({
    execute: vi.fn(),
  })

  it('returns toggleColumnTitles and toggleRowTitles functions', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useToggleHeadersInFirstColumn(true, mockPatch as never, 'myTable'),
    )

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('function')
  })

  describe('useToggleHeadersInFirstColumn', () => {
    it('calls patch.execute with set operation when enabling', () => {
      const mockPatch = createMockPatch()
      const {result} = renderHook(() =>
        useToggleHeadersInFirstColumn(false, mockPatch as never, 'myTable'),
      )

      result.current(true)

      expect(mockPatch.execute).toHaveBeenCalledWith([
        {set: {'myTable.headersInFirstColumn': true}},
      ])
    })

    it('calls patch.execute with unset operation when disabling', () => {
      const mockPatch = createMockPatch()
      const {result} = renderHook(() =>
        useToggleHeadersInFirstColumn(true, mockPatch as never, 'myTable'),
      )

      result.current(false)

      expect(mockPatch.execute).toHaveBeenCalledWith([{unset: ['myTable.headersInFirstColumn']}])
    })

    it('uses correct path for nested tables', () => {
      const mockPatch = createMockPatch()
      const {result} = renderHook(() =>
        useToggleHeadersInFirstColumn(false, mockPatch as never, 'content.tables[0]'),
      )

      result.current(true)

      expect(mockPatch.execute).toHaveBeenCalledWith([
        {set: {'content.tables[0].headersInFirstColumn': true}},
      ])
    })
  })
})
