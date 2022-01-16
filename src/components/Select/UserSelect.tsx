import { useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
  ALL_ACTIVE_USERS_SHALLOW_QUERY,
  UserNode,
  UserThumbnail,
} from 'modules/users'
import { useCallback, useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import styled from 'styled-components'
import { ZIndexRange } from 'types/enums'

const Wrapper = styled.div`
  display: flex;
  width: 400px;
  position: relative;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow.default};
  margin: 0;

  ${props => props.theme.media.mobile} {
    width: 100%;
  }
`
const SelectedUser = styled.span`
  font-size: 18px;
`
const SelectWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  height: 45px;
  padding: 5px;
`

interface OpenProps {
  open: boolean
}

const DropdownContainer = styled.div<OpenProps>`
  display: ${props => (props.open ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
  max-height: 400px;
  background-color: ${props => props.theme.colors.lightGray};
  position: absolute;
  border-radius: 0 0 10px 10px;
  box-shadow: ${props => props.theme.shadow.default};
  top: 45px;
  z-index: ${ZIndexRange.Dropdowns};
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
const ResultContainer = styled.div`
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`

const ResultRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  height: 40px;
  padding: 0 5px;
  font-size: 16px;
  justify-content: space-between;
  &:hover {
    background-color: ${props => props.theme.colors.lightGray};
  }
`

const ResultRowName = styled.span``

const Chevron = styled(FontAwesomeIcon)<OpenProps>`
  transform: ${props => (props.open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 250ms ease-in-out;
`
interface UserSelectProps {
  userId?: string
  setUserCallback: (slectedId: string) => void
}

type ShallowUser = Pick<
  UserNode,
  'id' | 'profileImage' | 'fullName' | 'initials'
>

export const UserSelect: React.VFC<UserSelectProps> = ({
  userId = '',
  setUserCallback,
}) => {
  /*
   * Improvements:
   *   - Enter handling -> Autoselect top selection
   */

  const [selectDisplayName, setSelectDisplayName] = useState('')
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<ShallowUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<ShallowUser[]>([])
  const [open, setOpen] = useState(false)

  useQuery<AllUsersShallowQueryReturns, AllUsersShallowQueryVariables>(
    ALL_ACTIVE_USERS_SHALLOW_QUERY,
    {
      onCompleted({ allActiveUsers }) {
        const flattenedUsers = allActiveUsers.edges.map(edge => edge.node)
        setUsers(flattenedUsers)
        setFilteredUsers(flattenedUsers)
        if (userId !== '') {
          const index = flattenedUsers.findIndex(user => user.id === userId)
          setSelectDisplayName(flattenedUsers[index].fullName)
        }
      },
    }
  )

  useEffect(() => {
    const result = users.filter(user => {
      const parsedName = user.fullName.toLowerCase()
      const parsedSearch = search.toLowerCase()
      return parsedName.includes(parsedSearch)
    })
    setFilteredUsers(result)
  }, [search, setFilteredUsers, users])

  const handleSelectUser = useCallback(
    user => {
      setUserCallback(user.id)
      setSelectDisplayName(user.fullName)
      setOpen(false)
      setSearch('')
    },
    [setSearch, setOpen, setSelectDisplayName, setUserCallback]
  )

  const handleToggleSelect = useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  const handleClickOutside = () => {
    setOpen(false)
  }
  return (
    <OutsideClickHandler onOutsideClick={handleClickOutside}>
      <Wrapper>
        <SelectWrapper onClick={handleToggleSelect}>
          <SelectedUser>{selectDisplayName}</SelectedUser>
          <Chevron icon="chevron-down" size="sm" open={open} />
        </SelectWrapper>
        <DropdownContainer open={open}>
          <UserSearchContainer>
            <UserSearch>
              <UserSearchInput
                value={search}
                onChange={evt => setSearch(evt.target.value)}
                placeholder="Søk etter bruker"
              />
              <FontAwesomeIcon icon="search" size="sm" />
            </UserSearch>
          </UserSearchContainer>
          <ResultContainer>
            {filteredUsers.map(user => (
              <ResultRow
                key={user.id}
                onClick={() => {
                  handleSelectUser(user)
                }}
              >
                <ResultRowName>{user.fullName}</ResultRowName>
                {/* Thumbnail needs a size between tiny and small */}
                <UserThumbnail user={user} size="small" />
              </ResultRow>
            ))}
          </ResultContainer>
        </DropdownContainer>
      </Wrapper>
    </OutsideClickHandler>
  )
}
