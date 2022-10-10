import Select from 'react-select'
import { internalGroupPositionTypeOptions } from './consts'
import { InternalGroupPositionType } from './types'
import { InternalGroupPositionTypeOption } from './types'

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
