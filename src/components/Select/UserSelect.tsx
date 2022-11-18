import { useQuery } from '@apollo/client'
import { Select, SelectProps } from '@mantine/core'
import { ALL_ACTIVE_USERS_LIST_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import styled from 'styled-components'
import { usersToSelectOption } from 'util/user'

interface UserSelectProps extends Omit<SelectProps, 'data' | 'value'> {
  userId?: string
  fullwidth?: boolean
  width?: string
  setUserCallback?: (userId: string) => void
}

export const UserSelect: React.FC<UserSelectProps> = ({
  userId,
  setUserCallback,
  ...rest
}) => {
  const { loading, data } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_LIST_QUERY, { variables: { q: '' } })

  const options = usersToSelectOption(data?.allActiveUsersList)
  const initialValue = options.find(option => option.value == userId)

  return (
    <Select
      value={userId}
      placeholder={'Velg bruker'}
      searchable
      limit={20}
      defaultValue={initialValue?.value}
      data={options}
      onChange={setUserCallback}
      {...rest}
    />
  )
}
