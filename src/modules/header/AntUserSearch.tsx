import { useLazyQuery } from '@apollo/client'
import { AutoComplete, Col, Input, Row } from 'antd'
import { UserThumbnail } from 'modules/users'
import { ALL_ACTIVE_USERS_SHALLOW_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDebounce } from 'util/hooks'

interface UserOption {
  label: JSX.Element
  value: string
}

export const AntUserSearch: React.VFC = () => {
  /* TODOS
   * - Need to reset the input field after selecting (Renders user.id now)
   * - Responsiveness?
   *
   */
  const [name, setName] = useState('')
  const debouncedName = useDebounce(name)
  const history = useHistory()
  const [options, setOptions] = useState<UserOption[]>([])
  const [execute, { loading, data }] = useLazyQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_SHALLOW_QUERY, { variables: { q: debouncedName } })

  useEffect(() => {
    if (debouncedName === '') {
      return
    }
    execute()
  }, [debouncedName, execute])

  useEffect(() => {
    if (data === undefined) return
    const users = data.allActiveUsers.edges.map(user => user.node)
    const userOptions = users.map(user => ({
      value: user.id,
      label: (
        <Row justify="space-between" align="middle">
          <Col span={1}>{user.fullName}</Col>
          <Col>
            <UserThumbnail user={user} size="small" />
          </Col>
        </Row>
      ),
    }))
    setOptions(userOptions)
  }, [data, setOptions])

  const handleSelectUser = (id: string) => {
    history.push(`/users/${id}`)
    setName('')
  }

  return (
    <AutoComplete
      placeholder="Søk etter bruker"
      style={{ width: 'auto' }}
      onSearch={setName}
      options={options}
      onSelect={handleSelectUser}
    >
      <Input.Search loading={loading} />
    </AutoComplete>
  )
}
