import { useQuery } from '@apollo/client'
import { Select } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { SEARCHBAR_USERS_QUERY } from 'modules/users/queries'
import { useState } from 'react'

interface SearchbarUsersReturns {
  searchbarUsers: { id: string; getCleanFullName: string }[]
}

interface RosterUserSearchProps {
  value: string | null
  onChange: (userId: string | null) => void
  excludedIds: string[]
  error?: string
}

// The same user search as the slot picker in the v2 view
export const RosterUserSearch: React.FC<RosterUserSearchProps> = ({
  value,
  onChange,
  excludedIds,
  error,
}) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search.trim(), 200)
  const { data, previousData } = useQuery<SearchbarUsersReturns>(
    SEARCHBAR_USERS_QUERY,
    {
      variables: { searchString: debouncedSearch },
      skip: debouncedSearch === '',
    }
  )

  const excluded = new Set(excludedIds)
  const options = ((data ?? previousData)?.searchbarUsers ?? [])
    .filter(user => !excluded.has(user.id))
    .map(user => ({ value: user.id, label: user.getCleanFullName }))

  return (
    <Select
      label="Person"
      placeholder="Søk etter navn"
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      // The backend searches; do not filter the results again
      filter={({ options: all }) => all}
      data={options}
      value={value}
      onChange={onChange}
      nothingFoundMessage={debouncedSearch === '' ? undefined : 'Ingen treff'}
      error={error}
    />
  )
}
