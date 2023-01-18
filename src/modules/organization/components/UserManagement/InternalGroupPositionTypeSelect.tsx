import { Select } from '@mantine/core'
import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import { InternalGroupPositionType } from 'modules/organization/types.graphql'

interface InternalGroupPositionTypeSelectProps {
  onChange: (
    internalGroupPositionType: InternalGroupPositionType | null
  ) => void
}

export const InternalGroupPositionTypeSelect: React.FC<
  InternalGroupPositionTypeSelectProps
> = ({ onChange }) => {
  const options = internalGroupPositionTypeOptions
  return (
    <Select
      data={options}
      label="Vervtype"
      placeholder="Velg en vervtype"
      onChange={onChange}
    />
  )
}
