import {defineType, ObjectInputProps} from 'sanity'

import RichTableBock from '../components/RichTableBock'
import RichTableInput from '../components/RichTableInput'

function RichTableBlockInput(props: ObjectInputProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <RichTableInput {...(props as any)} isInPortableText />
}

export default defineType({
  name: 'richTableBlock',
  title: 'Rich Table Block',
  type: 'richTable',
  components: {
    block: RichTableBock,
    input: RichTableBlockInput,
  },
})
