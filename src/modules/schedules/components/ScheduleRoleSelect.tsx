import { Select } from '@mantine/core'
import { RoleValues } from '../consts'
import { parseShiftRole } from '../util'

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
    value: RoleValues.BARISTA,
    label: parseShiftRole(RoleValues.BARISTA),
  },
  {
    value: RoleValues.BARSERVITOR,
    label: parseShiftRole(RoleValues.BARSERVITOR),
  },
  {
    value: RoleValues.BARTENDER,
    label: parseShiftRole(RoleValues.BARTENDER),
  },
  {
    value: RoleValues.BARSJEF,
    label: parseShiftRole(RoleValues.BARSJEF),
  },
  {
    value: RoleValues.SPRITBARTENDER,
    label: parseShiftRole(RoleValues.SPRITBARTENDER),
  },
  {
    value: RoleValues.SPRITBARSJEF,
    label: parseShiftRole(RoleValues.SPRITBARSJEF),
  },
  {
    value: RoleValues.BRANNVAKT,
    label: parseShiftRole(RoleValues.BRANNVAKT),
  },
  {
    value: RoleValues.HOVMESTER,
    label: parseShiftRole(RoleValues.HOVMESTER),
  },
  {
    value: RoleValues.KAFEANSVARLIG,
    label: parseShiftRole(RoleValues.KAFEANSVARLIG),
  },
  {
    value: RoleValues.KOKK,
    label: parseShiftRole(RoleValues.KOKK),
  },
  {
    value: RoleValues.SOUSCHEF,
    label: parseShiftRole(RoleValues.SOUSCHEF),
  },
  {
    value: RoleValues.UGLE,
    label: parseShiftRole(RoleValues.UGLE),
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
