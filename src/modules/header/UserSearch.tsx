import { useLazyQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ALL_ACTIVE_USERS_SHALLOW_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Select, { components, DropdownIndicatorProps } from 'react-select'
import styled from 'styled-components'
import { useDebounce } from 'util/hooks'
import { UserOption, usersToSelectOption } from 'util/user'

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

const DropdownIndicator = (
  props: DropdownIndicatorProps<UserOption, false>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <FontAwesomeIcon size="1x" icon="search" type="brand" />
    </components.DropdownIndicator>
  )
}

export const UserSearch: React.VFC = () => {
  const [userQuery, setUserQuery] = useState('')
  const debounceQuery = useDebounce(userQuery)
  const [selected, setSelected] = useState<UserOption | null>(null)
  const history = useHistory()

  const [execute, { loading, data }] = useLazyQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_SHALLOW_QUERY, { variables: { q: debounceQuery } })

  useEffect(() => {
    if (debounceQuery) {
      execute()
    }
  }, [debounceQuery])

  const handleSelectUser = useCallback(
    (userId: string | undefined) => {
      if (userId) {
        setUserQuery('')
        setSelected(null)
        history.push(`/users/${userId}`)
      }
    },
    [setUserQuery, history]
  )
  const options = usersToSelectOption(data?.allActiveUsers)

  return (
    <Wrapper>
      <Select
        isLoading={loading}
        onInputChange={val => setUserQuery(val)}
        onChange={val => handleSelectUser(val?.value)}
        options={options}
        value={selected}
        styles={{
          container: () => ({ width: '100%' }),
        }}
        placeholder="Search..."
        components={{ DropdownIndicator }}
      />
    </Wrapper>
  )
}
