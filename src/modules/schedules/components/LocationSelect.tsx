import { Select, SelectProps } from '@mantine/core'
import { locationOptions, LocationValues } from '../consts'

interface LocationSelectProps extends Omit<SelectProps, 'data'> {
  value: LocationValues | null
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  ...rest
}) => {
  return (
    <Select
      data={locationOptions}
      value={value}
      onChange={onChange}
      {...rest}
    />
  )
}
