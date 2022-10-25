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

interface UserMultiSelectProps
  extends Omit<MultiSelectProps, 'data' | 'value'> {
  users?: string[]
  width?: string
  placeholder?: string
  label?: React.ReactNode
  size?: MantineSize | undefined
  fullwidth?: boolean
  setUsersCallback?: (users: string[]) => void
}

export const UserMultiSelect: React.FC<UserMultiSelectProps> = ({
  users = [],
  size,
  label,
  placeholder,
  setUsersCallback,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState('')
  const { data, loading } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_LIST_QUERY, { variables: { q: inputValue } })

  const options = usersToSelectOption(data?.allActiveUsersList)
  const initialValue = options.filter(option => users.includes(option.value))

  function handleSelectChange(value: string[]) {
    setUsersCallback && setUsersCallback([...users, value[value.length - 1]])
  }
  return (
    <MultiSelect
      value={users}
      searchValue={inputValue}
      onSearchChange={setInputValue}
      placeholder={placeholder}
      onChange={handleSelectChange}
      limit={50}
      data={options}
      withinPortal
      searchable
      defaultValue={initialValue.map(option => option.value)}
      nothingFound="Ingen brukere funnet"
      {...rest}
    />
  )
}
