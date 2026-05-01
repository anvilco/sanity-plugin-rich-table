import {renderHook} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'

import useAddRow from '../../hooks/useAddRow'
import {RichTableType} from '../../schemas/richTable.object'
import {RICH_TABLE_ROW_TYPE} from '../../schemas/row.object'

describe('useAddRow', () => {
  const createMockPatch = () => ({
    execute: vi.fn(),
  })

  const createMockValue = (colCount: number, rowCount: number = 1): RichTableType => ({
    rows: Array.from({length: rowCount}, () => ({
      _type: RICH_TABLE_ROW_TYPE,
      _key: 'row-key',
      cells: Array.from({length: colCount}, () => ({
        _type: 'richTableCell' as const,
        _key: 'cell-key',
        content: [],
      })),
    })),
    columnHeaders: Array.from({length: colCount}, (_, i) => ({
      _type: 'columnHeader',
      _key: `header-${i}`,
      cellIndex: i,
    })),
  })

  it('returns a function', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddRow({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(3),
      }),
    )

    expect(typeof result.current).toBe('function')
  })

  it('calls patch.execute when invoked', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddRow({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(3),
      }),
    )

    result.current()

    expect(mockPatch.execute).toHaveBeenCalled()
  })

  it('creates a row with correct number of cells based on column headers', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddRow({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(4),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    expect(executeCall).toHaveLength(1)
    expect(executeCall[0].insert).toBeDefined()
    expect(executeCall[0].insert.items).toHaveLength(1)

    const newRow = executeCall[0].insert.items[0]
    expect(newRow.cells).toHaveLength(4)
  })

  it('creates cells with correct structure', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddRow({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(2),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    const newRow = executeCall[0].insert.items[0]
    const cell = newRow.cells[0]

    expect(cell._type).toBe('richTableCell')
    expect(cell._key).toBeDefined()
    expect(cell.content).toBeDefined()
    expect(Array.isArray(cell.content)).toBe(true)
    expect(cell.content[0]._type).toBe('block')
  })

  it('inserts after the last row', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddRow({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(2),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    expect(executeCall[0].insert.after).toBe('myTable.rows[-1]')
  })

  it('uses correct path for nested tables', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddRow({
        patch: mockPatch as never,
        path: 'content.blocks[0].table',
        value: createMockValue(2),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    expect(executeCall[0].insert.after).toBe('content.blocks[0].table.rows[-1]')
  })

  it('creates row with _type and _key', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddRow({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(1),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    const newRow = executeCall[0].insert.items[0]

    expect(newRow._type).toBe(RICH_TABLE_ROW_TYPE)
    expect(newRow._key).toBeDefined()
    expect(typeof newRow._key).toBe('string')
  })

  it('handles empty column headers gracefully', () => {
    const mockPatch = createMockPatch()
    const emptyValue: RichTableType = {
      rows: [],
      columnHeaders: [],
    }

    const {result} = renderHook(() =>
      useAddRow({
        patch: mockPatch as never,
        path: 'myTable',
        value: emptyValue,
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    const newRow = executeCall[0].insert.items[0]
    // When columnHeaders is empty, creates row with 0 cells
    // (colCount is 0, and 0 ?? 1 still equals 0 since 0 is not nullish)
    expect(newRow.cells).toHaveLength(0)
  })

  it('memoizes the callback', () => {
    const mockPatch = createMockPatch()
    const value = createMockValue(2)

    const {result, rerender} = renderHook(
      ({path}) =>
        useAddRow({
          patch: mockPatch as never,
          path,
          value,
        }),
      {initialProps: {path: 'myTable'}},
    )

    const firstCallback = result.current

    // Rerender with same props
    rerender({path: 'myTable'})
    expect(result.current).toBe(firstCallback)

    // Rerender with different path
    rerender({path: 'differentTable'})
    expect(result.current).not.toBe(firstCallback)
  })
})
