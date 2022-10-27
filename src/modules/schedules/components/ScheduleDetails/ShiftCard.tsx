import {
  Avatar,
  Badge,
  Button,
  Card,
  createStyles,
  Divider,
  Group,
  Modal,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { IconClock, IconTrash } from '@tabler/icons'
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
import { theme } from 'theme'
import { format } from 'util/date-fns'
import { AddShiftSlotPopover } from './AddShiftSlotPopover'
import { ShiftCardModal } from './ShiftCardModal'
import { ShiftCardSlot } from './ShiftCardSlot'

interface ShiftCardProps {
  shift: ShiftNode
}
export const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const [opened, setOpened] = useState(false)
  const { classes } = useShiftCardStyles({ shift: shift })
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
          <Text weight={600} size="lg">
            {shift.name}
          </Text>
          <UnstyledButton>
            <IconTrash
              size="18px"
              onClick={handleDeleteShift}
              color="lightgray"
            />
          </UnstyledButton>
        </Group>
        <Group mt="xs" position="apart">
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
        <Group position="right" spacing="xs">
          <IconClock size="20" color="gray" />
          <Text color="gray">
            {format(new Date(shift.datetimeStart), 'HH:mm')} -{' '}
            {format(new Date(shift.datetimeEnd), 'HH:mm')}
          </Text>
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

const useShiftCardStyles = createStyles((theme, { shift }: ShiftCardProps) => ({
  shift: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    padding: theme.spacing.md,
    boxShadow: theme.shadows.xs,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: shift.isFilled ? theme.white : theme.colors.red[0],
    color: theme.black,
  },
}))

/*

      {shift.slots.map(slot => (
        <ShiftCardSlot key={slot.id} shiftSlot={slot} />
      ))}

*/
