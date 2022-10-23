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
import { IconTrash } from '@tabler/icons'
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
          <Text>{shift.name}</Text>
          <UnstyledButton>
            <IconTrash
              size="18px"
              onClick={handleDeleteShift}
              color={'lightgray'}
            />
          </UnstyledButton>
        </Group>
        <Group>
          <Text>{format(new Date(shift.datetimeStart), 'HH:mm')}</Text>
          <Badge variant="filled" color={'samfundet-red.4'} size="sm">
            {' '}
            <Text weight={800} transform={'uppercase'}>
              {parseLocation(shift.location)}
            </Text>
          </Badge>
        </Group>
        <Divider my="xs" />
        <Avatar.Group mt={'xs'}>
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
    boxShadow: theme.shadows.xs,
    marginBottom: theme.spacing.xs,
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
