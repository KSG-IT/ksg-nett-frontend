import { Select } from '@mantine/core'
import { RoleValues } from '../consts'
import { parseShiftRole } from '../util'

// Create value label pars in list
const shiftRoleData = [
  {
    value: RoleValues.ARRANGEMENTANSVARLIG,
    label: parseShiftRole(RoleValues.ARRANGEMENTANSVARLIG),
  },
  {
    value: RoleValues.ARRANGEMENTBARTENDER,
    label: parseShiftRole(RoleValues.ARRANGEMENTBARTENDER),
  },
  {
    value: RoleValues.KAFEANSVARLIG,
    label: parseShiftRole(RoleValues.KAFEANSVARLIG),
  },
  {
    value: RoleValues.BARISTA,
    label: parseShiftRole(RoleValues.BARISTA),
  },
  {
    value: RoleValues.HOVMESTER,
    label: parseShiftRole(RoleValues.HOVMESTER),
  },
  {
    value: RoleValues.BARSERVITOR,
    label: parseShiftRole(RoleValues.BARSERVITOR),
  },
  {
    value: RoleValues.BARSJEF,
    label: parseShiftRole(RoleValues.BARSJEF),
  },
  {
    value: RoleValues.BARTENDER,
    label: parseShiftRole(RoleValues.BARTENDER),
  },
  {
    value: RoleValues.SOUSCHEF,
    label: parseShiftRole(RoleValues.SOUSCHEF),
  },
  {
    value: RoleValues.KOKK,
    label: parseShiftRole(RoleValues.KOKK),
  },
  {
    value: RoleValues.UGLE,
    label: parseShiftRole(RoleValues.UGLE),
  },
  {
    value: RoleValues.BRANNVAKT,
    label: parseShiftRole(RoleValues.BRANNVAKT),
  },
]

interface ShiftRoleSelectProps {
  value: RoleValues
  onChangeCallback: (val: RoleValues) => void
}

export const ShiftRoleSelect: React.FC<ShiftRoleSelectProps> = ({
  value,
  onChangeCallback,
}) => {
  return (
    <Select value={value} onChange={onChangeCallback} data={shiftRoleData} />
  )
}
