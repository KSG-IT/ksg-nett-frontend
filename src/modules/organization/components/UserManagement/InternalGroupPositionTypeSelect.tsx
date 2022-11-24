import { internalGroupPositionTypeOptions } from 'modules/organization/consts'
import { InternalGroupPositionTypeOption } from 'modules/organization/types.graphql'
import Select from 'react-select'

interface InternalGroupPositionTypeSelectProps {
  defaultValue?: InternalGroupPositionTypeOption | null
  selected: InternalGroupPositionTypeOption | null
  onChange: (
    internalGroupPositionType: InternalGroupPositionTypeOption | null
  ) => void
}

export const InternalGroupPositionTypeSelect: React.FC<
  InternalGroupPositionTypeSelectProps
> = ({ selected, defaultValue = null, onChange }) => {
  const options = internalGroupPositionTypeOptions
  return (
    <Select defaultValue={defaultValue} onChange={onChange} options={options} />
  )
}
