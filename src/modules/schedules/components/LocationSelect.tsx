import { Select, SelectProps } from '@mantine/core'
import { LocationValues } from '../consts'

const locationOptions = [
  { value: LocationValues.BODEGAEN, label: 'Bodegaen' },
  { value: LocationValues.DAGLIGHALLEN_BAR, label: 'Daglighallen bar' },
  { value: LocationValues.LYCHE_BAR, label: 'Lyche bar' },
  { value: LocationValues.LYCHE_KJOKKEN, label: 'Lyche kjøkken' },
  { value: LocationValues.STROSSA, label: 'Strossa' },
  { value: LocationValues.STORSALEN, label: 'Storsalen' },
  { value: LocationValues.KLUBBEN, label: 'Klubben' },
  { value: LocationValues.RUNDHALLEN, label: 'Rundhallen' },
]
interface LocationSelectProps extends Omit<SelectProps, 'data'> {
  value: LocationValues | null
  onChange: (val: LocationValues) => void
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
