import { Group, Text, TextProps } from '@mantine/core'
import { IconCrown } from '@tabler/icons-react'
import { RoleValues } from '../../consts'
import { isShiftLeader } from '../../scheduleGrid'
import { parseShiftRole } from '../../util'

interface RoleLabelProps extends TextProps {
  role: RoleValues
}

// A shift leader role gets a crown and dark, bold text. A worker role keeps
// the style from the props.
export const RoleLabel: React.FC<RoleLabelProps> = ({ role, ...rest }) => {
  if (!isShiftLeader(role)) return <Text {...rest}>{parseShiftRole(role)}</Text>
  return (
    <Group gap={4} wrap="nowrap">
      <IconCrown
        size={14}
        color="var(--mantine-color-yellow-7)"
        aria-label="Skiftleder"
      />
      <Text {...rest} c="dark" fw={700}>
        {parseShiftRole(role)}
      </Text>
    </Group>
  )
}
