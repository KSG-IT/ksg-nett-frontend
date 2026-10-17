import { useQuery } from '@apollo/client'
import { MultiSelect } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { SEARCHBAR_USERS_QUERY } from 'modules/users/queries'
import {
  SearchbarUsersQueryReturns,
  SearchbarUsersQueryVariables,
} from 'modules/users/types'
import { useState } from 'react'
import { UserOption } from 'util/user'
import { ChatMember } from '../types.graphql'
import { memberAwareOptions, withPicked } from '../util'

interface ChatUserPickerProps {
  picked: UserOption[]
  onChange: (picked: UserOption[]) => void
  members: ChatMember[]
}

// Searches users on the server as you type (10 hits per search). The picked
// users stay in the options, so their pills keep their names when the
// results change.
export const ChatUserPicker: React.FC<ChatUserPickerProps> = ({
  picked,
  onChange,
  members,
}) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search.trim(), 200)
  const { data, previousData } = useQuery<
    SearchbarUsersQueryReturns,
    SearchbarUsersQueryVariables
  >(SEARCHBAR_USERS_QUERY, {
    variables: { searchString: debouncedSearch },
    skip: debouncedSearch === '',
  })

  const results = ((data ?? previousData)?.searchbarUsers ?? []).map(user => ({
    value: user.id,
    label: user.getCleanFullName,
  }))
  const options = memberAwareOptions(withPicked(picked, results), members)

  function handleChange(ids: string[]) {
    const byId = new Map(options.map(option => [option.value, option]))
    onChange(ids.map(id => ({ value: id, label: byId.get(id)?.label ?? '' })))
  }

  return (
    <MultiSelect
      data-autofocus
      aria-label="Søk etter bruker"
      placeholder="Søk etter bruker"
      leftSection={<IconSearch size={18} />}
      data={options}
      value={picked.map(user => user.value)}
      onChange={handleChange}
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      // The backend searches; do not filter the results again
      filter={({ options: all }) => all}
      clearable
      hidePickedOptions
      nothingFoundMessage={debouncedSearch === '' ? undefined : 'Ingen treff'}
      comboboxProps={{ withinPortal: true }}
    />
  )
}
