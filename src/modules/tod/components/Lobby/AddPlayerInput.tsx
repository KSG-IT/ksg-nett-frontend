import { useQuery } from '@apollo/client'
import { Select } from '@mantine/core'
import { useRef, useState } from 'react'
import { useDebounce } from 'util/hooks'
import { NewPlayer } from '../../game'
import { GUEST_OPTION, guestToPlayer, memberToPlayer } from '../../players'
import { TOD_PLAYER_SEARCH_QUERY } from '../../queries'
import {
  TodPlayerSearchReturns,
  TodPlayerSearchVariables,
} from '../../types.graphql'
import classes from './Lobby.module.css'
import { PlayerSearchOption } from './PlayerSearchOption'

interface AddPlayerInputProps {
  onAdd: (player: NewPlayer) => void
}

// Search for a KSG member, or add any name as a guest. Members come first,
// so Enter picks a member when one matches.
export const AddPlayerInput: React.FC<AddPlayerInputProps> = ({ onAdd }) => {
  const [search, setSearch] = useState('')
  // Mantine writes the picked label back into the search after a submit.
  // Remember the label, so that write clears the field instead.
  const submittedLabel = useRef<string | null>(null)
  const debounced = useDebounce(search)
  const { data, previousData } = useQuery<
    TodPlayerSearchReturns,
    TodPlayerSearchVariables
  >(TOD_PLAYER_SEARCH_QUERY, {
    variables: { searchString: debounced },
    skip: !debounced,
  })

  const users = debounced ? (data ?? previousData)?.searchbarUsers ?? [] : []
  const usersById = new Map(users.map(user => [user.id, user]))
  const guestName = search.trim()
  const options = [
    ...users.map(user => ({ value: user.id, label: user.getCleanFullName })),
    ...(guestName
      ? [{ value: GUEST_OPTION, label: `Legg til «${guestName}» som gjest` }]
      : []),
  ]

  const handleSubmit = (value: string) => {
    const user = usersById.get(value)
    if (user) onAdd(memberToPlayer(user))
    else if (value === GUEST_OPTION && guestName)
      onAdd(guestToPlayer(guestName, Date.now()))
    submittedLabel.current =
      options.find(option => option.value === value)?.label ?? null
    setSearch('')
  }

  const handleSearchChange = (value: string) => {
    if (submittedLabel.current !== null && value === submittedLabel.current) {
      submittedLabel.current = null
      setSearch('')
      return
    }
    submittedLabel.current = null
    setSearch(value)
  }

  return (
    <Select
      aria-label="Legg til spiller"
      placeholder="Søk etter en KSG-er, eller skriv et navn"
      searchable
      value={null}
      searchValue={search}
      onSearchChange={handleSearchChange}
      data={options}
      filter={({ options }) => options}
      onOptionSubmit={handleSubmit}
      nothingFoundMessage={null}
      size="lg"
      classNames={{
        input: classes.input,
        dropdown: classes.dropdown,
        option: classes.option,
      }}
      renderOption={({ option }) => (
        <PlayerSearchOption
          user={usersById.get(option.value) ?? null}
          label={option.label}
        />
      )}
    />
  )
}
