import {useCallback} from 'react'
import {OperationsAPI} from 'sanity'

import {RichTableType} from '../schemas/richTable.object'

/** Hook to toggle the presence of column and row titles in a rich table. */
export const useToggleTitles = (
  hasColumnTitles: RichTableType['hasColumnTitles'],
  hasRowTitles: RichTableType['hasRowTitles'],
  patch: OperationsAPI['patch'],
  path: string,
) => {
  const toggleColumnTitles = useCallback(
    (newValue: boolean) => {
      const hasColumnTitlePath = `${path}.hasColumnTitles`
      const setPatch = {
        set: {[hasColumnTitlePath]: true},
      }
      const unsetPatch = {
        unset: [hasColumnTitlePath],
      }
      if (newValue) {
        patch.execute([setPatch])
      } else {
        patch.execute([unsetPatch])
      }
    },
    [patch, path],
  )

  const toggleRowTitles = useCallback(
    (newValue: boolean) => {
      const hasRowTitlePath = `${path}.hasRowTitles`
      const setPatch = {
        set: {[hasRowTitlePath]: true},
      }
      const unsetPatch = {
        unset: [hasRowTitlePath],
      }
      if (newValue) {
        patch.execute([setPatch])
      } else {
        patch.execute([unsetPatch])
      }
    },
    [patch, path],
  )
  return {
    toggleColumnTitles,
    toggleRowTitles,
  }
}
