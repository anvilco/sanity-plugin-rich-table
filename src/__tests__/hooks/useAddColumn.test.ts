import {renderHook} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'

import {useAddColumn} from '../../hooks/useAddColumn'
import {RichTableType} from '../../schemas/richTable.object'
import {RICH_TABLE_ROW_TYPE} from '../../schemas/row.object'

describe('useAddColumn', () => {
  const createMockPatch = () => ({
    execute: vi.fn(),
  })

  const createMockValue = (colCount: number, rowCount: number = 2): RichTableType => ({
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
      useAddColumn({
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
      useAddColumn({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(3),
      }),
    )

    result.current()

    expect(mockPatch.execute).toHaveBeenCalled()
  })

  it('creates patch operations for each row plus header', () => {
    const mockPatch = createMockPatch()
    const rowCount = 3
    const {result} = renderHook(() =>
      useAddColumn({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(2, rowCount),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    // Should have one patch per row + one for the header
    expect(executeCall).toHaveLength(rowCount + 1)
  })

  it('creates cell patches with correct paths for each row', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddColumn({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(2, 3),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]

    // Check row patches (first 3)
    expect(executeCall[0].insert.after).toBe('myTable.rows[0].cells[-1]')
    expect(executeCall[1].insert.after).toBe('myTable.rows[1].cells[-1]')
    expect(executeCall[2].insert.after).toBe('myTable.rows[2].cells[-1]')
  })

  it('creates header patch with correct path', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddColumn({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(2, 2),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    // Last patch should be the header
    const headerPatch = executeCall[executeCall.length - 1]
    expect(headerPatch.insert.after).toBe('myTable.columnHeaders[-1]')
  })

  it('creates cells with correct structure', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddColumn({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(2, 1),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    const cellItem = executeCall[0].insert.items[0]

    expect(cellItem._type).toBe('richTableCell')
    expect(cellItem._key).toBeDefined()
    expect(cellItem.content).toBeDefined()
    expect(Array.isArray(cellItem.content)).toBe(true)
  })

  it('creates header with correct structure and cellIndex', () => {
    const mockPatch = createMockPatch()
    const colCount = 3
    const {result} = renderHook(() =>
      useAddColumn({
        patch: mockPatch as never,
        path: 'myTable',
        value: createMockValue(colCount, 1),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    const headerPatch = executeCall[executeCall.length - 1]
    const headerItem = headerPatch.insert.items[0]

    expect(headerItem._type).toBe('columnHeader')
    expect(headerItem._key).toBeDefined()
    expect(headerItem.cellIndex).toBe(colCount) // New column index
  })

  it('uses correct path for nested tables', () => {
    const mockPatch = createMockPatch()
    const {result} = renderHook(() =>
      useAddColumn({
        patch: mockPatch as never,
        path: 'content.blocks[0].table',
        value: createMockValue(2, 1),
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    expect(executeCall[0].insert.after).toBe('content.blocks[0].table.rows[0].cells[-1]')
    expect(executeCall[1].insert.after).toBe('content.blocks[0].table.columnHeaders[-1]')
  })

  it('handles table with no rows', () => {
    const mockPatch = createMockPatch()
    const valueWithNoRows: RichTableType = {
      rows: undefined,
      columnHeaders: [{_type: 'columnHeader', _key: 'h1', cellIndex: 0}],
    }

    const {result} = renderHook(() =>
      useAddColumn({
        patch: mockPatch as never,
        path: 'myTable',
        value: valueWithNoRows,
      }),
    )

    result.current()

    const executeCall = mockPatch.execute.mock.calls[0][0]
    // Should only have the header patch
    expect(executeCall).toHaveLength(1)
    expect(executeCall[0].insert.after).toBe('myTable.columnHeaders[-1]')
  })

  it('memoizes the callback', () => {
    const mockPatch = createMockPatch()
    const value = createMockValue(2)

    const {result, rerender} = renderHook(
      ({path}) =>
        useAddColumn({
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
