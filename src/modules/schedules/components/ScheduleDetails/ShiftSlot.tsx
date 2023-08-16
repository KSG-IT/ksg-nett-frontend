import { useLazyQuery } from '@apollo/client'
import {
  ActionIcon,
  Avatar,
  Card,
  createStyles,
  FocusTrap,
  Group,
  Popover,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconTrash, IconUserPlus, IconX } from '@tabler/icons-react'
import { RoleValues } from 'modules/schedules/consts'
import { useShiftSlotMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { ShiftNode, ShiftSlotNode } from 'modules/schedules/types.graphql'
import { UserThumbnail } from 'modules/users/components'
import { ALL_ACTIVE_USERS_LIST_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
  UserThumbnailProps,
} from 'modules/users/types'
import React, { useEffect, useState } from 'react'
import { SHIFT_DETAIL_QUERY } from './ShiftCardModal'

type UserType = {
  id: string
  getCleanFullName: string
  profileImage: string | null
  initials: string
}

interface ShiftSlotProps {
  shiftSlot: ShiftSlotNode
  data: UserType[]
  selectedUser: UserType | null
  queryString: string
  loading: boolean
  onSearchChange: (value: string) => void
  onSelectUser: (user: UserType | null) => void
}

interface FilledShiftSlotProps {
  shiftSlot: {
    id: string
    user: UserThumbnailProps['user']
    shift: Pick<ShiftNode, 'id'>
    role: RoleValues
  }
  data: UserType[]
  selectedUser: UserType | null
  queryString: string
  loading: boolean
  onSearchChange: (value: string) => void
  onSelectUser: (user: UserType | null) => void
}

const FilledShiftSlot: React.FC<FilledShiftSlotProps> = ({
  shiftSlot,
  data,
  queryString,
  onSelectUser,
  onSearchChange,
}) => {
  const { classes } = useStyles()
  const [popoverOpened, setPopoverOpened] = useState(false)

  function handleSelectUser(user: UserType | null) {
    onSelectUser(user)
    onSearchChange('')
    setPopoverOpened(false)
  }

  function togglePopover() {
    setPopoverOpened(popover => !popover)
  }

  return (
    <Popover
      width="target"
      position="bottom-start"
      opened={popoverOpened}
      onClose={() => setPopoverOpened(false)}
    >
      <Popover.Target>
        <UnstyledButton className={classes.shiftSlot} onClick={togglePopover}>
          <Group position="apart" noWrap>
            <Group spacing="xs">
              <div className={classes.iconContainer}>
                <UserThumbnail user={shiftSlot.user} />
              </div>
              <Stack spacing={0} className={classes.nameOverflow}>
                <Text className={classes.shiftSlotRoleText}>
                  {shiftSlot.role}
                </Text>
                <Text>{shiftSlot.user.getCleanFullName}</Text>
              </Stack>
            </Group>
            <ActionIcon
              onClick={(evt: React.MouseEvent) => {
                evt.stopPropagation()
                handleSelectUser(null)
              }}
            >
              <IconX />
            </ActionIcon>
          </Group>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Card className={classes.dropDown}>
          <Title order={4}>{shiftSlot.role}</Title>
          <TextInput
            value={queryString}
            placeholder="Søk etter bruker"
            onChange={evt => onSearchChange(evt.target.value)}
          />
          {data.length === 0 && <Text color="gray">Her var det tomt</Text>}
          <FocusTrap>
            <Stack spacing={0}>
              {data.map(user => (
                <UnstyledButton
                  className={classes.selectUserButton}
                  onClick={() => handleSelectUser(user)}
                >
                  <Group spacing="xs">
                    <Avatar src={user.profileImage} />
                    <Text>{user.getCleanFullName}</Text>
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
          </FocusTrap>
        </Card>
      </Popover.Dropdown>
    </Popover>
  )
}

const EmptyShiftSlot: React.FC<ShiftSlotProps> = ({
  shiftSlot,
  data,
  queryString,
  loading,
  onSelectUser,
  onSearchChange,
}) => {
  const { classes } = useStyles()
  const [popoverOpened, setPopoverOpened] = useState(false)

  function handleSelectUser(user: UserType) {
    onSelectUser(user)
    onSearchChange('')
    setPopoverOpened(false)
  }

  function togglePopover() {
    setPopoverOpened(popover => !popover)
  }

  function handleClosePopover() {
    onSearchChange('')
    setPopoverOpened(false)
  }

  return (
    <Popover
      width="target"
      position="bottom-start"
      opened={popoverOpened}
      onClose={handleClosePopover}
    >
      <Popover.Target>
        <UnstyledButton className={classes.shiftSlot} onClick={togglePopover}>
          <Group spacing="xs">
            <div className={classes.iconContainer}>
              <IconUserPlus size={24} />
            </div>
            <Stack spacing={0}>
              <Text className={classes.shiftSlotRoleText}>
                {shiftSlot.role}
              </Text>
              <Text color="gray">Tom vakt</Text>
            </Stack>
          </Group>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Card className={classes.dropDown}>
          <Title order={4}>{shiftSlot.role}</Title>
          <TextInput
            value={queryString}
            placeholder="Søk etter bruker"
            onChange={evt => onSearchChange(evt.target.value)}
          />
          <FocusTrap>
            <Stack spacing={0}>
              {data.map(user => (
                <UnstyledButton
                  className={classes.selectUserButton}
                  onClick={() => handleSelectUser(user)}
                >
                  <Group spacing="md">
                    <Avatar src={user.profileImage} />

                    <Text>{user.getCleanFullName}</Text>
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
          </FocusTrap>
        </Card>
      </Popover.Dropdown>
    </Popover>
  )
}

interface ShallowShiftProps {
  shiftSlot: ShiftSlotNode
}

export const ShiftSlot: React.FC<ShallowShiftProps> = ({ shiftSlot }) => {
  const [getUsers, { loading }] = useLazyQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_LIST_QUERY)

  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUser, setSelectedUser] = useState<UserType | null>(
    shiftSlot.user
  )
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 500)

  const { deleteShiftSlot, addUserToShiftSlot, removeUserFromShiftSlot } =
    useShiftSlotMutations()

  useEffect(() => {
    if (debouncedQuery === '') {
      setUsers([])
      return
    }
    getUsers({
      variables: {
        q: debouncedQuery,
      },
      onCompleted({ allActiveUsersList }) {
        setUsers(allActiveUsersList)
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }, [debouncedQuery])

  function handleDeleteShiftSlot() {
    deleteShiftSlot({
      variables: {
        id: shiftSlot.id,
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY, SHIFT_DETAIL_QUERY],
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  function handleSelectUser(user: UserType | null) {
    if (user === null) {
      removeUserFromShiftSlot({
        variables: {
          shiftSlotId: shiftSlot.id,
        },
        refetchQueries: [
          NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
          SHIFT_DETAIL_QUERY,
        ],
        onCompleted() {
          setSelectedUser(user)
        },
        onError({ message }) {
          showNotification({
            title: 'Noe gikk galt',
            message,
          })
        },
      })
    } else {
      addUserToShiftSlot({
        variables: {
          shiftSlotId: shiftSlot.id,
          userId: user.id,
        },
        refetchQueries: [
          NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
          SHIFT_DETAIL_QUERY,
        ],
        onCompleted() {
          setSelectedUser(user)
        },
        onError({ message }) {
          showNotification({
            title: 'Noe gikk galt',
            message,
          })
        },
      })
    }
  }

  if (shiftSlot.user) {
    return (
      <Group position="apart">
        <FilledShiftSlot
          shiftSlot={shiftSlot as FilledShiftSlotProps['shiftSlot']}
          data={users}
          selectedUser={selectedUser}
          queryString={query}
          loading={loading}
          onSearchChange={setQuery}
          onSelectUser={handleSelectUser}
        />
        <UnstyledButton onClick={handleDeleteShiftSlot}>
          <IconTrash />
        </UnstyledButton>
      </Group>
    )
  }

  return (
    <Group position="apart">
      <EmptyShiftSlot
        shiftSlot={shiftSlot}
        data={users}
        selectedUser={selectedUser}
        queryString={query}
        loading={loading}
        onSearchChange={setQuery}
        onSelectUser={handleSelectUser}
      />
      <UnstyledButton onClick={handleDeleteShiftSlot}>
        <IconTrash />
      </UnstyledButton>
    </Group>
  )
}

const useStyles = createStyles(t => ({
  shiftSlot: {
    height: 50,
    width: 275,
    border: '1px solid black',
    fontSize: 12,
    borderRadius: t.radius.md,
    padding: '0 10px',
    '&:hover': {
      backgroundColor: t.colors['samfundet-red'][4],
      div: {
        color: 'white',
      },
    },
  },
  nameOverflow: {
    textOverflow: 'ellipsis',
  },
  shiftSlotRoleText: {
    fontSize: 10,
    color: 'gray',
    fontWeight: 500,
    '&:hover': {
      color: 'white',
    },
  },
  dropDown: {
    maxHeight: 500,
    overflowY: 'scroll',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: '100%',
  },
  selectUserButton: {
    padding: t.spacing.xs,
    borderBottom: `1px solid ${t.colors.gray[3]}`,
    '&:hover': {
      backgroundColor: t.colors['samfundet-red'][4],
      color: 'white',
      div: {
        color: 'white',
      },
    },
  },
}))
