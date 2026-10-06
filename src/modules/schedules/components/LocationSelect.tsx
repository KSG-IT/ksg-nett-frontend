import { Select, SelectProps } from '@mantine/core'
import { LocationValues } from '../consts'
import { enumHandler } from 'util/parsing'

const locationOptions = [
  { value: LocationValues.BODEGAEN, label: 'Bodegaen' },
  { value: LocationValues.DAGLIGHALLEN_BAR, label: 'Daglighallen bar' },
  { value: LocationValues.EDGAR, label: 'Edgar' },
  { value: LocationValues.LYCHE_BAR, label: 'Lyche bar' },
  { value: LocationValues.LYCHE_KJOKKEN, label: 'Lyche kjøkken' },
  { value: LocationValues.STROSSA, label: 'Strossa' },
  { value: LocationValues.SELSKAPSSIDEN, label: 'Selskapssiden' },
  { value: LocationValues.SERVERING_C, label: 'Siri' },
  { value: LocationValues.SERVERING_D, label: 'Vollan' },
  { value: LocationValues.SERVERING_K, label: 'Skala' },
  { value: LocationValues.STORSALEN, label: 'Storsalen' },
  { value: LocationValues.KLUBBEN, label: 'Klubben' },
  { value: LocationValues.RUNDHALLEN, label: 'Rundhallen' },
  { value: LocationValues.KONTORET, label: 'Kontoret' },
]
interface LocationSelectProps extends Omit<SelectProps, 'data' | 'onChange'> {
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
      onChange={enumHandler(LocationValues, onChange)}
      {...rest}
    />
  )
}
