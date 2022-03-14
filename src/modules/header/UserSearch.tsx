import { useLazyQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ALL_ACTIVE_USERS_SHALLOW_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { components, DropdownIndicatorProps } from 'react-select'
import Async from 'react-select/async'
import styled from 'styled-components'
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
  const [selected, setSelected] = useState<UserOption | null>(null)
  const history = useHistory()

  const [execute, { loading }] = useLazyQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_SHALLOW_QUERY, { variables: { q: userQuery } })

  const promiseOptions = async (value: string) => {
    const { data } = await execute({ variables: { q: value } })
    return usersToSelectOption(data?.allActiveUsers)
  }

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

  return (
    <Wrapper>
      <Async
        isLoading={loading}
        loadOptions={promiseOptions}
        onInputChange={val => setUserQuery(val)}
        onChange={val => handleSelectUser(val?.value)}
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
