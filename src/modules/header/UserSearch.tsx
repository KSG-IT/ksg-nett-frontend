import { useQuery } from '@apollo/client'
import { Group, Loader, Select, Text } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { UserThumbnail } from 'modules/users/components'
import { SEARCHBAR_USERS_QUERY } from 'modules/users/queries'
import {
  SearchbarUsersQueryReturns,
  SearchbarUsersQueryVariables,
  UserNode,
} from 'modules/users/types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'util/hooks'

export const UserSearch: React.FC = () => {
  const [userQuery, setUserQuery] = useState('')
  const debounceQuery = useDebounce(userQuery)
  const navigate = useNavigate()

  const { data, previousData, loading } = useQuery<
    SearchbarUsersQueryReturns,
    SearchbarUsersQueryVariables
  >(SEARCHBAR_USERS_QUERY, {
    variables: { searchString: debounceQuery },
    skip: !debounceQuery,
  })

  const users = (data ?? previousData)?.searchbarUsers ?? []
  const usersById = new Map(users.map(user => [user.id, user as UserNode]))

  return (
    <Select
      w={{ base: '100%', xs: 300 }}
      placeholder="Search..."
      searchable
      value={null}
      searchValue={userQuery}
      onSearchChange={setUserQuery}
      data={users.map(user => ({
        value: user.id,
        label: user.getCleanFullName,
      }))}
      filter={({ options }) => options}
      onOptionSubmit={userId => {
        setUserQuery('')
        navigate(`/users/${userId}`)
      }}
      nothingFoundMessage={debounceQuery && !loading ? 'Ingen treff' : null}
      rightSection={loading ? <Loader size="xs" /> : <IconSearch size={16} />}
      rightSectionPointerEvents="none"
      renderOption={({ option }) => {
        const user = usersById.get(option.value)
        return (
          <Group justify="space-between" wrap="nowrap" w="100%">
            <Text size="sm">{option.label}</Text>
            {user && <UserThumbnail user={user} size="sm" />}
          </Group>
        )
      }}
    />
  )
}
