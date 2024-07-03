import { useLazyQuery } from '@apollo/client'
import { Group } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { IconSearch } from '@tabler/icons-react'
import { UserThumbnail } from 'modules/users/components'
import { SEARCHBAR_USERS_QUERY } from 'modules/users/queries'
import {
  SearchbarUsersQueryReturns,
  SearchbarUsersQueryVariables,
  UserNode,
} from 'modules/users/types'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select, { components, DropdownIndicatorProps } from 'react-select'
import { useDebounce } from 'util/hooks'

const DropdownIndicator = (
  props: DropdownIndicatorProps<UserSearchOption, false>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <IconSearch />
    </components.DropdownIndicator>
  )
}

interface UserSearchOption {
  label: string
  value: string
  user: UserNode
}

const Option = (props: UserSearchOption) => (
  <Group align="apart">
    {props.label}
    <UserThumbnail user={props.user} size="sm" />
  </Group>
)

export const UserSearch: React.VFC = () => {
  const { classes } = useStyles()
  const [userQuery, setUserQuery] = useState('')
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
        isLoading={loading}
        onInputChange={val => setUserQuery(val)}
        onChange={val => val && handleSelectUser(val.value)}
        options={options}
        value={selected}
        styles={{
          container: () => ({ width: '100%' }),
        }}
        placeholder="Search..."
        components={{ DropdownIndicator }}
        formatOptionLabel={data => <Option {...data} />}
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
    zIndex: 9000,

    [theme.breakpoints.xs]: {
      width: '100%',
      padding: 0,
    },
  },
}))
