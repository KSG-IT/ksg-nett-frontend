import { useLazyQuery } from '@apollo/client'
import { IconSearch } from '@tabler/icons'
import { UserThumbnail } from 'modules/users/components'
import {
  ALL_ACTIVE_USERS_LIST_QUERY,
  ALL_ACTIVE_USERS_SHALLOW_QUERY,
} from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
  UserNode,
} from 'modules/users/types'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select, { components, DropdownIndicatorProps } from 'react-select'
import styled from 'styled-components'
import { useDebounce } from 'util/hooks'

const Wrapper = styled.div`
  height: 35px;
  width: 300px;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  position: relative;
  align-items: center;
  padding: 5px;

  ${props => props.theme.media.mobile} {
    width: 100%;
    padding: 0;
  }
`

const SelectEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

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
  <SelectEntry>
    {props.label}
    <UserThumbnail user={props.user} size="sm" />
  </SelectEntry>
)

export const UserSearch: React.VFC = () => {
  const [userQuery, setUserQuery] = useState('')
  const debounceQuery = useDebounce(userQuery)
  const [selected, setSelected] = useState<UserSearchOption | null>(null)
  const navigate = useNavigate()

  const [execute, { loading, data }] = useLazyQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_LIST_QUERY, { variables: { q: debounceQuery } })

  useEffect(() => {
    if (debounceQuery) {
      execute()
    }
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
    data?.allActiveUsersList.map(user => ({
      value: user.id,
      label: user.getCleanFullName,
      user: user as UserNode,
    })) || []

  return (
    <Wrapper>
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
    </Wrapper>
  )
}
