import {
  Avatar,
  Badge,
  Card,
  Divider,
  Group,
  Text,
  Tooltip,
} from '@mantine/core'
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
        <Group position="apart" align={'flex-end'}>
          <Text className={classes.title}>{shift.name}</Text>
        </Group>
        <Group position="apart" className={classes.roster}>
          <Badge variant="filled" color={`${color}.1`} size="sm" radius="sm">
            <Text weight={700} transform={'uppercase'} color={`${color}.9`}>
              {location}
            </Text>
          </Badge>
          <Avatar.Group>
            {shift.slots.map(slot => {
              if (slot.user) {
                return <UserThumbnail user={slot.user} size="sm" />
              } else {
                return (
                  <Avatar
                    color={'samfundet-red'}
                    size={'sm'}
                    radius={'xl'}
                    placeholder="https://m.media-amazon.com/images/M/MV5BMjA5NTE4NTE5NV5BMl5BanBnXkFtZTcwMTcyOTY5Mw@@._V1_.jpg"
                  />
                )
              }
            })}
          </Avatar.Group>
        </Group>
        <Divider mt="md" mb="xs" />
        <Group position="apart">
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

const useShiftCardStyles = createStyles(theme => ({
  title: {
    fontWeight: 600,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.gray[9],
  },
  shift: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    padding: theme.spacing.md,
    boxShadow: theme.shadows.xs,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.white,
    color: theme.black,
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray[0],
    },
  },
  roster: {
    marginTop: theme.spacing.xs,
    minHeight: '26px',
  },
  shiftTime: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: '4px',
    color: theme.colors.gray[6],
    fontWeight: 500,
  },
  isFilled: {
    display: 'flex',
    alignItems: 'center',
    color: theme.colors.yellow[5],
  },
  rowReverse: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}))
