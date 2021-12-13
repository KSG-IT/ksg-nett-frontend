import { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import { ALL_ACTIVE_USERS_SHALLOW_QUERY } from 'modules/users/queries'
import { useDebounce } from 'util/hooks'
import { UserNode } from 'modules/users/types'
import { UserThumbnail } from 'modules/users'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import { Spinner } from 'components/Loading'

const Wrapper = styled.div`
  height: 35px;
  width: 300px;
  display: flex;
  flex-direction: row;
  box-shadow: ${props => props.theme.shadow.default};
  border-radius: 10px;
  position: relative;
  align-items: center;
  padding: 5px;

  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.purple};
  }

  ${props => props.theme.media.mobile} {
    width: 100%;
    padding: 0;
  }
`

const AutoCompleteBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 90%;
  height: minmax(45px, 600px);
  top: 35px;
  left: 10px;

  overlow-y: scroll;
  background-color: ${props => props.theme.colors.lightGray};
  box-shadow: ${props => props.theme.shadow.default};
`

const AutoCompleteRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  gap: 10px;
  height: 35px;
  background-color: ${props => props.theme.colors.white};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.lightGray};
  }
`

const Input = styled.input`
  margin: 0;
  border: none;
  height: 100%;
  width: 100%;

  &:focus {
    outline: none;
  }
`

type UserShallowSearchNode = Pick<
  UserNode,
  'id' | 'initials' | 'profileImage' | 'fullName'
>

export const UserSearch: React.VFC = () => {
  /*
    - On mobile we can move this component to the Sidebar instead? On top of the sidebar.
    - If we combine the typing and query loading state the component would probably appear
    to be more reactive
    - Detect click outside has a "disabled prop" -> combine and mount this state toghter with
    whether or not we should be rendering the display box? Is that possible even?
  */
  const inputRef = useRef<HTMLInputElement>(null)
  const [userQuery, setUserQuery] = useState('')
  const history = useHistory()
  const [cursor, setCursor] = useState<number | null>(null)
  const debouncedQuery = useDebounce(userQuery)
  const [displaySuggestions, setDisplaySuggestions] = useState(false)

  const [searchResults, setSearchResults] = useState<UserShallowSearchNode[]>(
    []
  )
  const { loading, data } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_SHALLOW_QUERY, { variables: { q: debouncedQuery } })

  const handleSelectUser = useCallback(
    (userId: string) => {
      setCursor(null)
      setUserQuery('')
      history.push(`/users/${userId}`)
    },
    [setCursor, setUserQuery, history]
  )

  const handleOnFocus = useCallback(() => {
    if (userQuery === '') return
    setDisplaySuggestions(true)
  }, [setDisplaySuggestions, userQuery])

  const handleClickOutside = useCallback(() => {
    setDisplaySuggestions(false)
  }, [setDisplaySuggestions])

  // Handles movement of cursor and selection with keys
  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (searchResults.length === 0) return
      const { code } = evt
      const sanitizedCursor = cursor === null ? -1 : cursor

      switch (code) {
        case 'ArrowUp':
          setCursor((sanitizedCursor - 1) % searchResults.length)
          break
        case 'ArrowDown':
          setCursor((sanitizedCursor + 1) % searchResults.length)
          break
        case 'Enter':
          const { id } = searchResults[sanitizedCursor]
          handleSelectUser(id)
          break
        default:
          return
      }
    },
    [searchResults, cursor, handleSelectUser]
  )

  // handles if we render the suggestions or not
  useEffect(() => {
    if (userQuery === '') {
      setDisplaySuggestions(false)
      return
    }
    setDisplaySuggestions(true)
  }, [userQuery, setDisplaySuggestions])

  // Handles data normalization
  useEffect(() => {
    if (data === undefined) return

    const users = data.allActiveUsers.edges.map(user => user.node)
    setSearchResults(users)
  }, [data, setSearchResults])

  return (
    <OutsideClickHandler onOutsideClick={handleClickOutside}>
      <Wrapper>
        <Input
          ref={inputRef}
          value={userQuery}
          onFocus={handleOnFocus}
          onChange={evt => setUserQuery(evt.target.value)}
          placeholder="Søk etter bruker..."
          onKeyDown={handleKeyDown}
        />
        <FontAwesomeIcon icon="search" />
        {displaySuggestions && (
          <AutoCompleteBox>
            {loading ? (
              <Spinner />
            ) : (
              searchResults.map((user, i) => (
                <AutoCompleteRow
                  key={user.id}
                  onClick={() => {
                    handleSelectUser(user.id)
                  }}
                >
                  {i === cursor ? (
                    <span>
                      <FontAwesomeIcon icon="caret-right" size="sm" />
                      {user.fullName}
                    </span>
                  ) : (
                    <span>{user.fullName}</span>
                  )}
                  <UserThumbnail user={user} size="small" />
                </AutoCompleteRow>
              ))
            )}
          </AutoCompleteBox>
        )}
      </Wrapper>
    </OutsideClickHandler>
  )
}
