import {AddIcon} from '@sanity/icons'
import {Box, Button, Flex, Stack, Text, Tooltip} from '@sanity/ui'
import {ComponentType, ReactNode} from 'react'
import {OperationsAPI} from 'sanity'

import {useAddColumn} from '../hooks/useAddColumn'
import useAddRow from '../hooks/useAddRow'
import {RichTableType} from '../schemas/richTable.object'

interface TableButtonsProps {
  path: string
  children: ReactNode
  /** Patch function from Sanity document operations for optimistic changes */
  patch: OperationsAPI['patch']
  value: RichTableType
  readOnly: boolean | undefined
  tableId?: string
}

/** # Table Buttons Component
 *  Adds a button to add columns and rows to the table.
 */
const TableButtons: ComponentType<TableButtonsProps> = (props) => {
  const {value, path, patch, readOnly, tableId} = props

  // Hooks must be called unconditionally at the top level
  const handleAddColumn = useAddColumn({path, value, patch})
  const handleAddRow = useAddRow({path, value, patch})

  if (readOnly) return props.children

  return (
    <Stack space={4} aria-label="Table controls">
      <Flex gap={4}>
        {props.children}
        <Tooltip
          content={
            <Box>
              <Text size={1}>Add column</Text>
            </Box>
          }
          placement="left"
          portal
        >
          <Button
            icon={AddIcon}
            onClick={handleAddColumn}
            mode={'ghost'}
            disabled={readOnly}
            aria-label={'Add column'}
            aria-controls={tableId}
          />
        </Tooltip>
      </Flex>
      <Tooltip
        content={
          <Box>
            <Text size={1}>Add Row</Text>
          </Box>
        }
        portal
      >
        <Button
          icon={AddIcon}
          onClick={handleAddRow}
          mode={'ghost'}
          disabled={readOnly}
          aria-label={'Add row'}
          aria-controls={tableId}
        />
      </Tooltip>
    </Stack>
  )
}
export default TableButtons
