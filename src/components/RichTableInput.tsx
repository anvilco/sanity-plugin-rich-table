import {ExpandIcon, ResetIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Stack, Switch, Text, Tooltip} from '@sanity/ui'
import {ChangeEvent, ComponentType, Suspense, useCallback, useMemo, useState} from 'react'
import {
  getPublishedId,
  ObjectInputProps,
  pathToString,
  useDocumentOperation,
  useFormValue,
  useSchema,
} from 'sanity'

import {useToggleHeadersInFirstColumn} from '../hooks/useToggleHeadersInFirstColumn'
import {RichTableType} from '../schemas/richTable.object'
import {isRichTableArrayMemberContext} from '../utils/isRichTableArrayMemberContext'
import ConfirmClearTableDialog from './ConfirmClearTableDialog'
import ExpandedTableDialog from './ExpandedTableDialog'
import InitialiseTable from './InitialiseTable'
import LoadingIndicator from './LoadingIndicator'
import Table from './Table'

const RichTableInput: ComponentType<
  ObjectInputProps<RichTableType> & {isInPortableText?: boolean}
> = (props) => {
  const _id = useFormValue(['_id']) as string
  const _type = useFormValue(['_type']) as string
  const schema = useSchema()

  // Document operations -> with optimistic changes
  const {patch} = useDocumentOperation(getPublishedId(_id), _type)

  const pathString = pathToString(props.path)

  const isInArray = useMemo(
    () =>
      isRichTableArrayMemberContext({
        schema,
        documentTypeName: _type,
        path: props.path,
        objectSchemaTypeName: props.schemaType.name,
        isInPortableText: props.isInPortableText,
      }),
    [_type, props.isInPortableText, props.path, props.schemaType.name, schema],
  )
  // table ID
  const tableId = `table-${props.id}`

  // * Expand table dialog
  const [openDialog, setOpenDialog] = useState(false)
  const handleOpen = useCallback(() => setOpenDialog(true), [])
  const handleClose = useCallback(() => setOpenDialog(false), [])
  // * Confirm clear table dialog
  const [openConfirmClearDialog, setOpenConfirmClearDialog] = useState(false)
  const handleOpenConfirmClearDialog = useCallback(() => setOpenConfirmClearDialog(true), [])
  const handleCloseConfirmClearDialog = useCallback(() => setOpenConfirmClearDialog(false), [])

  const {headersInFirstColumn} = props.value || {}
  const toggleHeadersInFirstColumn = useToggleHeadersInFirstColumn(
    headersInFirstColumn,
    patch,
    pathString,
  )

  return (
    <Stack space={4} as={'section'} aria-label={'Rich table input'}>
      <Suspense fallback={<LoadingIndicator />} name={'RichTableInput Suspense'}>
        {!props.value?.rows && (
          <InitialiseTable
            patch={patch}
            path={pathString}
            isInPortableText={props.isInPortableText}
            isInArray={isInArray}
            readOnly={props.readOnly}
            onChange={props.onChange}
            schemaTypeName={props.schemaType.name}
          />
        )}
        {props.value && props.value.rows && (
          <>
            <Box>
              {/* EXPAND TABLE BUTTON */}
              <Flex justify={'flex-end'} gap={4}>
                <Tooltip
                  content={
                    <Box>
                      <Text size={1}>Clear table</Text>
                    </Box>
                  }
                  portal
                >
                  <Button
                    iconRight={ResetIcon}
                    onClick={handleOpenConfirmClearDialog}
                    mode={'bleed'}
                    fontSize={0}
                    text={'Clear table'}
                    muted
                    disabled={props.readOnly}
                    aria-label={'Clear table'}
                    aria-controls={tableId}
                    type="button"
                  />
                </Tooltip>
                <Tooltip
                  content={
                    <Box>
                      <Text size={1}>Expand table</Text>
                    </Box>
                  }
                  portal
                >
                  <Button
                    iconRight={ExpandIcon}
                    onClick={handleOpen}
                    mode={'bleed'}
                    fontSize={0}
                    text={
                      props.isInPortableText && !props.readOnly
                        ? 'Open table to edit'
                        : 'Expand table'
                    }
                    muted
                    disabled={props.readOnly}
                    aria-label={
                      props.isInPortableText && !props.readOnly
                        ? 'Open table to edit'
                        : 'Expand table'
                    }
                    aria-haspopup="dialog"
                    aria-expanded={openDialog}
                    aria-controls={tableId}
                    type="button"
                  />
                </Tooltip>
              </Flex>

              <Table
                {...props}
                isInDialog={false}
                handleOpen={handleOpen}
                patch={patch}
                isInPortableText={props.isInPortableText}
                // We need this key to force remounting the table when opening/closing the dialog
                key={openDialog ? 'table-in-dialog-open' : 'table-in-dialog-closed'}
                readOnly={props.isInPortableText ? true : props.readOnly}
                id={tableId}
              />
            </Box>
            {openDialog && (
              <ExpandedTableDialog {...props} isInDialog handleClose={handleClose} patch={patch} />
            )}
          </>
        )}
      </Suspense>
      {openConfirmClearDialog && (
        <ConfirmClearTableDialog
          open={openConfirmClearDialog}
          onClose={handleCloseConfirmClearDialog}
          patch={patch}
          path={pathString}
          readOnly={props.readOnly}
        />
      )}
      <Flex justify={'flex-start'} align={'center'} gap={2} key={`debug-switch-${openDialog}`}>
        <Inline space={2}>
          <Text as={'label'} htmlFor={'headers-in-first-column-toggle'} size={0} muted>
            Has headers in first column?
          </Text>
          <Switch
            checked={headersInFirstColumn}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              toggleHeadersInFirstColumn(e.currentTarget.checked)
            }
            disabled={props.readOnly}
            label={'Has headers in first column?'}
            id={'headers-in-first-column-toggle'}
          />
        </Inline>
      </Flex>
    </Stack>
  )
}
export default RichTableInput
