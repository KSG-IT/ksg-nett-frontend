import { useState, useEffect, useLayoutEffect } from 'react'
import styled from 'styled-components'
import { v4 } from 'uuid'
import OutsideClickHandler from 'react-outside-click-handler'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserNode } from 'modules/users'
import {
  ALL_ACTIVE_USERS_SHALLOW_QUERY,
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users'
import { useQuery } from '@apollo/client'
import { ZIndexRange } from 'types/enums'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 400px;
  background-color: white;
`

const SelectedUsersContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 45px;
  max-height: 160px;
  padding: 5px;
  justify-content: space-between;
`

const SelectedUsersWorkspace = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

interface DropdownContainerProps {
  open: boolean
}

const DropdownContainer = styled.div<DropdownContainerProps>`
  display: ${props => (props.open ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 90%;
  max-height: 300px;
  width: 100%;
  z-index: ${ZIndexRange.Dropdowns};
`

interface DropdownContainerRowProps {
  selected: boolean
}

const DropdownContainerRow = styled.div<DropdownContainerRowProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
  height: 40px;
  padding: 0 5px;
  font-size: 16px;
  background-color: ${props =>
    props.selected ? props.theme.colors.midGray : props.theme.colors.lightGray};

  &:hover {
    filter: brightness(95%);
  }
`

const ResultContainer = styled.div`
  overflow-y: scroll;
`

const UserSearchContainer = styled.div`
  width: 100%;
  height: 50px;
  padding: 10px;
`
const UserSearch = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  padding: 5px;
  margin: 5px 0;
  background-color: ${props => props.theme.colors.white};
`

const UserSearchInput = styled.input`
  outline: none;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 5px;
`

const Badge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  height: 25px;
  margin: 2px;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadow.default};

  background-color: ${props => props.theme.colors.purpleAction};
  color: ${props => props.theme.colors.white};
  font-weight: 500;
  font-size: 10px;
  font-family: 'monospace';
  padding: 5px;
  border-radius: 5px;
  justify-content: space-between;
`

type UserMultiSelectNode = Pick<UserNode, 'id' | 'fullName'> & {
  selected: boolean
  localId: string
}

interface UserMultiSelectProps {
  users?: string[]
  setUsersCallback: (users: string[]) => void
}
export const UserMultiSelect: React.VFC<UserMultiSelectProps> = ({
  users = [],
  setUsersCallback,
}) => {
  const [selected, setSelected] = useState<UserMultiSelectNode[]>([])
  const [pool, setPool] = useState<UserMultiSelectNode[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserMultiSelectNode[]>([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useQuery<AllUsersShallowQueryReturns, AllUsersShallowQueryVariables>(
    ALL_ACTIVE_USERS_SHALLOW_QUERY,
    {
      onCompleted({ allActiveUsers }) {
        const flattenedUsers = allActiveUsers.edges.map(edge => {
          return {
            ...edge.node,
            selected: users.includes(edge.node.id) ? true : false,
            localId: v4(),
          }
        })
        setPool(flattenedUsers)
        setFilteredUsers(flattenedUsers)
      },
    }
  )

  const toggleOpen = () => {
    setOpen(!open)
  }

  useEffect(() => {
    const result = pool.filter(user => {
      const parsedName = user.fullName.toLowerCase()
      const parsedSearch = search.toLowerCase()
      return parsedName.includes(parsedSearch)
    })
    setFilteredUsers(result)
  }, [search, pool, setFilteredUsers])

  // we use useLayoutEffect to batch the visual update at the end of state changes
  useLayoutEffect(() => {
    const selectedUsers = pool.filter(user => user.selected)
    setSelected(selectedUsers)
    setUsersCallback(selectedUsers.map(user => user.id))
  }, [setSelected, pool, setUsersCallback])

  const handleToggleSelectedUser = (localId: string) => {
    let insert: number | null = null
    const tmp = pool.filter((user, i) => {
      if (user.localId === localId) {
        insert = i
      }
      return user.localId === localId
    })[0]

    if (insert === null) return
    const newTmp = { ...tmp, selected: !tmp.selected }
    const updatedList = [...pool]
    updatedList.splice(insert, 1, newTmp)

    setPool(updatedList)
    setSearch('')
  }
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setOpen(false)
      }}
    >
      <Wrapper>
        <SelectedUsersContainer>
          <SelectedUsersWorkspace>
            {selected.map(user => (
              <Badge
                key={user.localId}
                onClick={() => {
                  handleToggleSelectedUser(user.localId)
                }}
              >
                {user.fullName}
              </Badge>
            ))}
          </SelectedUsersWorkspace>
          <FontAwesomeIcon icon="chevron-down" size="sm" onClick={toggleOpen} />
        </SelectedUsersContainer>
        <DropdownContainer open={open}>
          <UserSearchContainer>
            <UserSearch>
              <UserSearchInput
                onChange={evt => {
                  setSearch(evt.target.value)
                }}
                value={search}
              />
              <FontAwesomeIcon icon="search" size="sm" />
            </UserSearch>
          </UserSearchContainer>
          <ResultContainer>
            {filteredUsers.map(user => (
              <DropdownContainerRow
                key={user.localId}
                onClick={() => {
                  handleToggleSelectedUser(user.localId)
                }}
                selected={user.selected}
              >
                <span>{user.fullName}</span>
                {user.selected && <FontAwesomeIcon icon="check" size="sm" />}
              </DropdownContainerRow>
            ))}
          </ResultContainer>
        </DropdownContainer>
      </Wrapper>
    </OutsideClickHandler>
  )
}
