import { Select } from '@mantine/core'
import { DayValues } from 'modules/schedules/consts'

interface DaySelectProps {
  value: DayValues
  onChangeCallback: (val: DayValues) => void
}

export const DaySelect: React.FC<DaySelectProps> = ({
  value,
  onChangeCallback,
}) => {
  const data = [
    { value: DayValues.MONDAY, label: 'Mandag' },
    { value: DayValues.TUESDAY, label: 'Tirsdag' },
    { value: DayValues.WEDNESDAY, label: 'Onsdag' },
    { value: DayValues.THURSDAY, label: 'Torsdag' },
    { value: DayValues.FRIDAY, label: 'Fredag' },
    { value: DayValues.SATURDAY, label: 'Lørdag' },
    { value: DayValues.SUNDAY, label: 'Søndag' },
  ]

  return (
    <Select
      label="Dag i uken"
      value={value}
      onChange={onChangeCallback}
      data={data}
    />
  )
}
