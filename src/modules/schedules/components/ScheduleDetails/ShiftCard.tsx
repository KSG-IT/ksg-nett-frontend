import {
  Avatar,
  Badge,
  Card,
  createStyles,
  Divider,
  Group,
  Modal,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { IconAlertTriangle, IconClock } from '@tabler/icons'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import {
  MY_UPCOMING_SHIFTS,
  NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
} from 'modules/schedules/queries'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { parseLocation } from 'modules/schedules/util'
import { UserThumbnail } from 'modules/users/components'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'util/date-fns'
import { ShiftCardModal } from './ShiftCardModal'

interface ShiftCardProps {
  shift: ShiftNode
}

export const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const [opened, setOpened] = useState(false)
  const { classes } = useShiftCardStyles()
  const theme = useMantineTheme()

  const { deleteShift } = useShiftMutations()

  function handleDeleteShift() {
    // Should trigger a confirm delete dialog
    deleteShift({
      variables: { id: shift.id },
      refetchQueries: [MY_UPCOMING_SHIFTS, NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Vakt slettet')
      },
    })
  }

  return (
    <>
      <Card
        withBorder
        className={classes.shift}
        onClick={() => setOpened(true)}
      >
        <Group position="apart" align={'flex-end'}>
          <Text className={classes.title}>{shift.name}</Text>
        </Group>
        <Group position="apart" className={classes.roster}>
          <Badge variant="filled" color="red.1" size="sm" radius="sm">
            <Text weight={700} transform={'uppercase'} color="red.9">
              {parseLocation(shift.location)}
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
          {!shift.isFilled ? (
            <Tooltip label="Skiftet er ikke fult">
              <i className={classes.isFilled}>
                <IconAlertTriangle />
              </i>
            </Tooltip>
          ) : (
            <div />
          )}
          <div className={classes.shiftTime}>
            <IconClock size="20" color="gray" />
            <Text className={classes.timeText}>
              {format(new Date(shift.datetimeStart), 'HH:mm')} -{' '}
              {format(new Date(shift.datetimeEnd), 'HH:mm')}
            </Text>
          </div>
        </Group>
      </Card>
      <Modal
        size={'md'}
        overlayColor={theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        onClose={() => setOpened(false)}
        title="Vakt"
      >
        <ShiftCardModal shift={shift} />
      </Modal>
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
}))
