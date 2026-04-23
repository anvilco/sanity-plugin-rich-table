import {useCallback} from 'react'
import {OperationsAPI} from 'sanity'

import {RichTableType} from '../schemas/richTable.object'

/** Hook to toggle the presence of column and row titles in a rich table. */
export const useToggleHeadersInFirstColumn = (
  headersInFirstColumn: RichTableType['headersInFirstColumn'],
  patch: OperationsAPI['patch'],
  path: string,
) => {
  const toggleHeadersInFirstColumn = useCallback(
    (newValue: boolean) => {
      const titlePath = `${path}.headersInFirstColumn`
      const setPatch = {
        set: {[titlePath]: true},
      }
      const unsetPatch = {
        unset: [titlePath],
      }
      if (newValue) {
        patch.execute([setPatch])
      } else {
        patch.execute([unsetPatch])
      }
    },
    [patch, path],
  )

  return toggleHeadersInFirstColumn
}
