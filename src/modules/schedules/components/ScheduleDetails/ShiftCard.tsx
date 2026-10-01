import { Avatar, Card, Divider, Group, Text, Tooltip } from '@mantine/core'
import { Badge } from 'components/Badge'
import { createStyles } from '@mantine/emotion'
import { IconAlertTriangle, IconClock } from '@tabler/icons-react'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { parseLocation } from 'modules/schedules/util'
import { UserThumbnail } from 'modules/users/components'
import { format } from 'util/date-fns'

interface ShiftCardProps {
  shift: ShiftNode
  setShiftModalCallback: (shift: string | null) => void
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  setShiftModalCallback,
}) => {
  const { classes } = useShiftCardStyles()

  const { name: location, color } = parseLocation(shift.location)
  return (
    <>
      <Card
        withBorder
        className={classes.shift}
        onClick={() => setShiftModalCallback(shift.id)}
      >
        <Group justify="space-between" align={'flex-end'}>
          <Text className={classes.title}>{shift.name}</Text>
        </Group>
        <Group justify="space-between" className={classes.roster}>
          <Badge variant="filled" color={`${color}.1`} size="sm" radius="sm">
            <Text fw={700} tt={'uppercase'} c={`${color}.9`}>
              {location}
            </Text>
          </Badge>
          <Avatar.Group>
            {shift.slots.map(slot => {
              if (slot.user) {
                return (
                  <UserThumbnail key={slot.id} user={slot.user} size="sm" />
                )
              } else {
                return (
                  <Avatar
                    key={slot.id}
                    color={'samfundet-red'}
                    size={'sm'}
                    radius={'xl'}
                  />
                )
              }
            })}
          </Avatar.Group>
        </Group>
        <Divider mt="md" mb="xs" />
        <Group justify="space-between">
          <div className={classes.shiftTime}>
            <IconClock size="20" color="gray" />
            <Text className={classes.timeText}>
              {format(new Date(shift.datetimeStart), 'HH:mm')} -{' '}
              {format(new Date(shift.datetimeEnd), 'HH:mm')}
            </Text>
          </div>
          {!shift.isFilled && (
            <Tooltip position="top" label="Mangler bemanning">
              <i className={classes.isFilled}>
                <IconAlertTriangle color="red" />
              </i>
            </Tooltip>
          )}
        </Group>
      </Card>
    </>
  )
}

const useShiftCardStyles = createStyles({
  title: {
    fontWeight: 600,
    fontSize: 'var(--mantine-font-size-lg)',
    color: 'var(--mantine-color-gray-9)',
  },
  shift: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    padding: 'var(--mantine-spacing-md)',
    boxShadow: 'var(--mantine-shadow-xs)',
    marginBottom: 'var(--mantine-spacing-sm)',
    borderRadius: 'var(--mantine-radius-md)',
    backgroundColor: 'white',
    color: 'black',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'var(--mantine-color-gray-0)',
    },
  },
  roster: {
    marginTop: 'var(--mantine-spacing-xs)',
    minHeight: '26px',
  },
  shiftTime: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: '4px',
    color: 'var(--mantine-color-gray-6)',
    fontWeight: 500,
  },
  isFilled: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--mantine-color-yellow-5)',
  },
  rowReverse: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
})
