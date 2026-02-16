import type {Dispatch, KeyboardEvent, SetStateAction} from 'react'

import {TableSize} from '../components/InitialiseTable'

/** Handle keyboard navigation for table size selection */
export const onKeyDownSelectCells = ({
  e,
  setSelected,
  selected,
  maxRows,
  maxCols,
  onChange,
}: {
  e: KeyboardEvent<HTMLDivElement>
  selected: TableSize
  setSelected: Dispatch<SetStateAction<TableSize>>
  maxCols: number
  maxRows: number
  onChange: () => void
}): void => {
  // change selection with arrow keys, commit with Enter
  let {rows, cols} = selected
  if (e.key === 'ArrowUp') {
    rows = Math.max(0, rows - 1)
    setSelected({rows, cols})
    e.preventDefault()
  } else if (e.key === 'ArrowDown') {
    rows = Math.min(maxRows, rows + 1)
    setSelected({rows, cols})
    e.preventDefault()
  } else if (e.key === 'ArrowLeft') {
    cols = Math.max(0, cols - 1)
    setSelected({rows, cols})
    e.preventDefault()
  } else if (e.key === 'ArrowRight') {
    cols = Math.min(maxCols, cols + 1)
    setSelected({rows, cols})
    e.preventDefault()
  } else if (e.key === 'Enter') {
    if (rows > 0 && cols > 0) {
      onChange()
    }
    e.preventDefault()
  }
}
