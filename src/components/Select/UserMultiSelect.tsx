import { useQuery } from '@apollo/client'
import { MultiSelect, MultiSelectProps } from '@mantine/core'
import { ALL_ACTIVE_USERS_LIST_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import { useState } from 'react'
import { usersToSelectOption } from 'util/user'

interface UserMultiSelectProps
  extends Omit<MultiSelectProps, 'data' | 'value'> {
  users?: string[]
  placeholder?: string
  setUsersCallback?: (users: string[]) => void
}

export const UserMultiSelect: React.FC<UserMultiSelectProps> = ({
  users = [],
  placeholder = 'Velg brukere',
  setUsersCallback,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState('')
  const { data } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_LIST_QUERY, { variables: { q: '' } })

  const options = usersToSelectOption(data?.allActiveUsersList)
  return (
    <MultiSelect
      value={users}
      searchValue={inputValue}
      onSearchChange={setInputValue}
      placeholder={placeholder}
      onChange={setUsersCallback}
      limit={30}
      clearable
      data={options}
      comboboxProps={{ withinPortal: true }}
      searchable
      nothingFoundMessage="Ingen brukere funnet"
      {...rest}
    />
  )
}
