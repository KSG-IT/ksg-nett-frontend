import { useLazyQuery } from '@apollo/client'
import {
  Group,
  Select,
  Text,
  createStyles,
  useMantineTheme,
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { UserThumbnail } from 'modules/users/components'
import { SEARCHBAR_USERS_QUERY } from 'modules/users/queries'
import {
  SearchbarUsersQueryReturns,
  SearchbarUsersQueryVariables,
  UserNode,
} from 'modules/users/types'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'util/hooks'

interface UserSearchOption {
  label: string
  value: string
  user: UserNode
}

const SelectItem = forwardRef<HTMLDivElement, UserSearchOption>(
  ({ user, label, ...others }: UserSearchOption, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <UserThumbnail user={user} />
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
)

export const UserSearch: React.FC = () => {
  const { classes } = useStyles()
  const [userQuery, setUserQuery] = useState('')
  const theme = useMantineTheme()
  const debounceQuery = useDebounce(userQuery)
  const [selected, setSelected] = useState<UserSearchOption | null>(null)
  const navigate = useNavigate()

  const [execute, { loading, data }] = useLazyQuery<
    SearchbarUsersQueryReturns,
    SearchbarUsersQueryVariables
  >(SEARCHBAR_USERS_QUERY)

  useEffect(() => {
    execute({
      variables: { searchString: debounceQuery },
    })
  }, [debounceQuery])

  const handleSelectUser = useCallback(
    (userId: string) => {
      if (userId) {
        setUserQuery('')
        setSelected(null)
        navigate(`/users/${userId}`)
      }
    },
    [setUserQuery, history]
  )
  const options: UserSearchOption[] =
    data?.searchbarUsers.map(user => ({
      value: user.id,
      label: user.getCleanFullName,
      user: user as UserNode,
    })) || []

  return (
    <div className={classes.wrapper}>
      <Select
        itemComponent={SelectItem}
        onChange={val => val && handleSelectUser(val)}
        onSearchChange={setUserQuery}
        searchValue={userQuery}
        value={selected?.value ?? null}
        data={options}
        limit={10}
        placeholder="Søk etter bruker"
        rightSection={<IconSearch color={theme.colors['gray'][4]} />}
        searchable
        style={{
          width: '100%',
        }}
      />
    </div>
  )
}

const useStyles = createStyles(theme => ({
  wrapper: {
    height: 35,
    width: 300,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
    position: 'relative',
    alignItems: 'center',
    padding: 5,

    [theme.breakpoints.xs]: {
      width: '100%',
      padding: 0,
    },
  },
}))
