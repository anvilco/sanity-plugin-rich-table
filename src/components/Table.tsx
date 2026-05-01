import {Card, Flex, Inline, Switch, Text} from '@sanity/ui'
import {ChangeEvent, ComponentType, Fragment} from 'react'
import {
  ArrayOfObjectsFormNode,
  ArrayOfObjectsItemMember,
  FieldMember,
  ObjectArrayFormNode,
  ObjectFormNode,
  ObjectInputProps,
  ObjectItem,
  OperationsAPI,
  Path,
  pathToString,
  stringToPath,
} from 'sanity'

import {useToggleHeadersInFirstColumn} from '../hooks/useToggleHeadersInFirstColumn'
import ContentPortableTextInput from '../portable-text/ContentPortableTextEditor'
import {RichTableCellType} from '../schemas/cell.object'
import {ColumnHeader} from '../schemas/columnHeader.object'
import {RichTableType} from '../schemas/richTable.object'
import {RichTableRowType} from '../schemas/row.object'
import ColumnContextMenu from './ColumnContextMenu'
import RowContextMenu from './RowContextMenu'
import TableButtons from './TableButtons'
import TableGrid from './TableGrid'
import TableScrollWrapper from './TableScrollWrapper'

function getContentPath({
  cellMember,
  cellKey,
  cellIndex,
  path,
  rowKey,
  rowIndex,
}: {
  cellMember: ArrayOfObjectsItemMember<ObjectArrayFormNode<RichTableCellType>> | undefined
  cellKey: string | undefined
  cellIndex: number
  path: string
  rowKey: string | undefined
  rowIndex: number
}): Path {
  if (cellMember) {
    return cellMember.item.path.concat('content')
  }

  const rowSelector = rowKey ? `_key=="${rowKey}"` : rowIndex
  const cellSelector = cellKey ? `_key=="${cellKey}"` : cellIndex

  return stringToPath(`${path}.rows[${rowSelector}].cells[${cellSelector}].content`)
}

// TODO: make row title / context menu sticky to the left side when scrolling horizontally?
const Table: ComponentType<
  ObjectInputProps<RichTableType> & {
    handleOpen?: () => void
    isInDialog?: boolean
    isInPortableText?: boolean
    /** Patch function from Sanity document operations for optimistic changes */
    patch: OperationsAPI['patch']
    id?: string
  }
> = ({isInDialog = false, handleOpen, value, onChange, patch, isInPortableText, id, ...props}) => {
  // * Prepare the path
  const path = pathToString(props.path)
  const tableId = id ?? `rich-table-${path}`
  // * Prepare members
  const tableObjectMembers = props.members as FieldMember[]

  const rowsFieldMember = tableObjectMembers?.find(
    (member) => member.name === 'rows',
  ) as FieldMember<ArrayOfObjectsFormNode<Array<RichTableRowType>>>

  const rowMembersWithCellMembers = rowsFieldMember?.field.members.map((rowI) => {
    const row = rowI as ArrayOfObjectsItemMember<ObjectArrayFormNode<RichTableRowType>>
    const rowItem = row.item
    const rowItemObjectMembers = rowItem.members as FieldMember<
      ObjectFormNode<Array<RichTableCellType>>
    >[]
    const cellsFieldMember = rowItemObjectMembers?.find((member) => member.name === 'cells')?.field
    return {
      rowMember: row,
      cellMembers: cellsFieldMember?.members as
        | ArrayOfObjectsItemMember<ObjectArrayFormNode<RichTableCellType>>[]
        | undefined,
    }
  })

  const rowMembersByKey = new Map(
    rowMembersWithCellMembers
      ?.map(({rowMember, cellMembers}) => {
        const rowKey = rowMember.item.value?._key
        return rowKey ? [rowKey, {rowMember, cellMembers}] : undefined
      })
      .filter((entry): entry is [string, NonNullable<typeof rowMembersWithCellMembers>[number]] =>
        Boolean(entry),
      ),
  )

  const columnHeaderFieldMember = tableObjectMembers?.find(
    (member) => member.name === 'columnHeaders',
  ) as FieldMember<ArrayOfObjectsFormNode<Array<ColumnHeader & ObjectItem>>>

  const columnHeaderMembers = columnHeaderFieldMember?.field.members as ArrayOfObjectsItemMember<
    ObjectArrayFormNode<ColumnHeader & ObjectItem>
  >[]

  const {headersInFirstColumn} = value!
  const toggleHeadersInFirstColumn = useToggleHeadersInFirstColumn(
    headersInFirstColumn,
    patch,
    path,
  )

  return (
    <Card
      padding={3}
      border
      radius={2}
      onDoubleClick={() => (isInPortableText && handleOpen?.() ? handleOpen() : undefined)}
      as="section"
      aria-label="Rich table"
    >
      <TableButtons
        path={path}
        value={value!}
        patch={patch}
        readOnly={props.readOnly}
        tableId={tableId}
      >
        <TableScrollWrapper>
          <TableGrid
            id={tableId}
            $rowCount={value?.rows?.length || 0}
            // we need to add one extra column for the row titles / context menu
            $columnCount={value?.columnHeaders?.length ? value?.columnHeaders?.length + 1 : 0}
            $isInDialog={false}
            role="table"
          >
            {/* Placeholder for row title column */}
            <div className={'placeholder-cell'} />

            {/* HEADER ROW */}
            {columnHeaderMembers?.map((colHeaderMember, columnIndex) => {
              const colHeaderItem = colHeaderMember.item.value
              // TODO: force remount when columnHeader value has changed in dialog but not in inline table input -> this is maybe caused by missing blur event in the input👇
              return (
                <Fragment key={colHeaderItem._key}>
                  <ColumnContextMenu
                    key={colHeaderItem._key}
                    columnIndex={columnIndex}
                    columnHeaderKey={colHeaderItem._key}
                    patch={patch}
                    value={value!}
                    path={path}
                    rowCount={value?.rows?.length || 0}
                    columnCount={value?.columnHeaders?.length || 0}
                    iconHorizontal
                    readOnly={props.readOnly}
                    role="columnheader"
                  />
                </Fragment>
              )
            })}

            {/* CONTENT ROWS AND CELLS */}
            {value?.rows?.map((rowValue, rowIndex) => {
              const matchedRow = rowValue._key ? rowMembersByKey.get(rowValue._key) : undefined
              const cellMembersByKey = new Map(
                matchedRow?.cellMembers
                  ?.map((cellMember) => {
                    const cellKey = cellMember.item.value?._key
                    return cellKey ? [cellKey, cellMember] : undefined
                  })
                  .filter(
                    (
                      entry,
                    ): entry is [
                      string,
                      ArrayOfObjectsItemMember<ObjectArrayFormNode<RichTableCellType>>,
                    ] => Boolean(entry),
                  ),
              )

              return rowValue.cells?.map((cellValueObject, cellIndex) => {
                const cellMember = cellValueObject._key
                  ? cellMembersByKey.get(cellValueObject._key)
                  : matchedRow?.cellMembers?.[cellIndex]
                const cellPTEPath = getContentPath({
                  cellMember,
                  cellKey: cellValueObject._key,
                  cellIndex,
                  path,
                  rowKey: rowValue._key,
                  rowIndex,
                })
                const cellValue = cellValueObject.content
                const cellId =
                  cellMember?.item.id ??
                  `${rowValue._key ?? rowIndex}-${cellValueObject._key ?? cellIndex}`

                return (
                  <Fragment key={cellId}>
                    {cellIndex === 0 && (
                      <RowContextMenu
                        rowIndex={rowIndex}
                        rowCount={value?.rows?.length || 0}
                        row={matchedRow?.rowMember.item.value ?? rowValue}
                        patch={patch}
                        path={path}
                        readOnly={props.readOnly}
                        role="rowheader"
                      />
                    )}
                    {/* PTE CELL CONTENT */}
                    <ContentPortableTextInput
                      onChange={onChange}
                      path={cellPTEPath}
                      value={cellValue}
                      key={cellId}
                      readOnly={props.readOnly}
                      // @ts-expect-error role prop not in type but needed for accessibility
                      role="cell"
                    />
                  </Fragment>
                )
              })
            })}
          </TableGrid>
        </TableScrollWrapper>
      </TableButtons>
      {isInDialog && (
        <Flex gap={3} justify={'flex-start'} align={'center'} paddingTop={3}>
          <Inline space={2}>
            <Text as={'label'} htmlFor={'headers-in-first-column-toggle'} size={0} muted>
              Has headers in first column
            </Text>
            <Switch
              checked={headersInFirstColumn}
              role="switch"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                toggleHeadersInFirstColumn(e.currentTarget.checked)
              }
              id={'headers-in-first-column-toggle'}
              aria-controls={tableId}
            />
          </Inline>
        </Flex>
      )}
    </Card>
  )
}
export default Table
