import {ComponentType} from 'react'
import {TbTable} from 'react-icons/tb'
import {
  defineArrayMember,
  defineField,
  defineType,
  ObjectInputProps,
  ObjectItem,
  type ObjectItemProps,
} from 'sanity'

import RichTableBock from '../components/RichTableBock'
import RichTableInput from '../components/RichTableInput'
import RichTableItem from '../components/RichTableItem'
import {ColumnHeader} from './columnHeader.object'
import {RichTableRowType} from './row.object'

export interface RichTableType {
  rows: Array<RichTableRowType> | undefined
  columnHeaders?: Array<ColumnHeader & ObjectItem>
  hasColumnTitles?: boolean
  hasRowTitles?: boolean
  headersInFirstColumn?: boolean
}

export default defineType({
  name: 'richTable',
  title: 'Rich Table',
  type: 'object',
  icon: TbTable,
  components: {
    input: RichTableInput as ComponentType<ObjectInputProps>,
    block: RichTableBock,
    item: RichTableItem as ComponentType<ObjectItemProps<ObjectItem>>,
  },
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      validation: (Rule) => Rule.min(1).error('A table must have at least one row.').required(),
      of: [
        defineArrayMember({
          type: 'richTableRow',
        }),
      ],
    }),
    defineField({
      name: 'columnHeaders',
      title: 'Column Headers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'columnHeader',
        }),
      ],
    }),
    defineField({
      name: 'headersInFirstColumn',
      title: 'Has headers in first column?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Rich Table',
      icon: TbTable,
    }),
  },
})
