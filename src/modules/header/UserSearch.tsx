import { useQuery } from '@apollo/client'
import { Group, Loader, Select, Text } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { TodSearchOption } from 'modules/tod/components/TodSearchOption'
import { TRUTH_OR_DRINK_ENABLED_QUERY } from 'modules/tod/queries'
import { isTodSearch, TOD_SEARCH_OPTION } from 'modules/tod/searchKeywords'
import { TruthOrDrinkEnabledReturns } from 'modules/tod/types.graphql'
import { TodRouteState } from 'modules/tod/views'
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

  // The flag is only asked for when the text matches, so a normal search
  // costs nothing extra.
  const todSearch = isTodSearch(userQuery)
  const { data: todData } = useQuery<TruthOrDrinkEnabledReturns>(
    TRUTH_OR_DRINK_ENABLED_QUERY,
    { skip: !todSearch }
  )
  const showTod = todSearch && todData?.truthOrDrinkEnabled === true

  const users = (data ?? previousData)?.searchbarUsers ?? []
  const usersById = new Map(users.map(user => [user.id, user as UserNode]))
  const options = [
    ...(showTod ? [{ value: TOD_SEARCH_OPTION, label: 'Truth or Drink' }] : []),
    ...users.map(user => ({
      value: user.id,
      label: user.getCleanFullName,
    })),
  ]

  const handleOptionSubmit = (value: string) => {
    setUserQuery('')
    if (value === TOD_SEARCH_OPTION) {
      const state: TodRouteState = { pour: true }
      navigate('/tod', { state })
      return
    }
    navigate(`/users/${value}`)
  }

  return (
    <Select
      w={{ base: '100%', xs: 300 }}
      placeholder="Search..."
      searchable
      value={null}
      searchValue={userQuery}
      onSearchChange={setUserQuery}
      data={options}
      filter={({ options }) => options}
      onOptionSubmit={handleOptionSubmit}
      nothingFoundMessage={debounceQuery && !loading ? 'Ingen treff' : null}
      rightSection={loading ? <Loader size="xs" /> : <IconSearch size={16} />}
      rightSectionPointerEvents="none"
      renderOption={({ option }) => {
        if (option.value === TOD_SEARCH_OPTION) return <TodSearchOption />
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
