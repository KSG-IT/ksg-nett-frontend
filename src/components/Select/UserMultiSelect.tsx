import { useQuery } from '@apollo/client'
import {
  createStyles,
  MantineSize,
  MultiSelect,
  MultiSelectProps,
} from '@mantine/core'
import {
  ALL_ACTIVE_USERS_LIST_QUERY,
  ALL_ACTIVE_USERS_SHALLOW_QUERY,
} from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import { useState } from 'react'
import { usersToSelectOption } from 'util/user'
import { Item, Value } from './SelectLabel'

interface UserMultiSelectProps
  extends Omit<MultiSelectProps, 'data' | 'value'> {
  users?: string[]
  width?: string
  placeholder?: string
  fullwidth?: boolean
  setUsersCallback?: (users: string[]) => void
}

export const UserMultiSelect: React.FC<UserMultiSelectProps> = ({
  users = [],
  placeholder,
  setUsersCallback,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState('')
  const { data, loading } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_LIST_QUERY, { variables: { q: '' } })

  const options = usersToSelectOption(data?.allActiveUsersList)
  const initialValue = options.filter(option => users.includes(option.value))
  return (
    <MultiSelect
      value={users}
      itemComponent={Item}
      valueComponent={Value}
      searchValue={inputValue}
      onSearchChange={setInputValue}
      placeholder={placeholder}
      onChange={setUsersCallback}
      limit={30}
      clearable
      data={options}
      withinPortal
      searchable
      defaultValue={initialValue.map(option => option.value)}
      nothingFound="Ingen brukere funnet"
      {...rest}
    />
  )
}
