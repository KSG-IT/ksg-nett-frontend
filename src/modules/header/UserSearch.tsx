import { useLazyQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Spinner } from 'components/Loading'
import { UserThumbnail } from 'modules/users'
import { ALL_ACTIVE_USERS_SHALLOW_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
  UserNode,
} from 'modules/users/types'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { clamp } from 'util/arithmetic'
import { useDebounce } from 'util/hooks'

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
  background-color: ${props => props.theme.colors.white};

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
  min-height: 60px;
  max-height: 600px;
  top: 35px;
  left: 10px;

  overflow-y: scroll;
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
  const inputRef = useRef<HTMLInputElement>(null)
  const [userQuery, setUserQuery] = useState('')
  const history = useHistory()
  const [cursor, setCursor] = useState<number | null>(null)
  const debouncedQuery = useDebounce(userQuery)
  const [displaySuggestions, setDisplaySuggestions] = useState(false)

  const [searchResults, setSearchResults] = useState<UserShallowSearchNode[]>(
    []
  )
  const [execute, { loading, data }] = useLazyQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_SHALLOW_QUERY, { variables: { q: debouncedQuery } })

  // === Side effects of component ===
  // executes query if debouncedQuery is not empty and has changed
  useEffect(() => {
    if (debouncedQuery === '') return
    execute()
  }, [debouncedQuery, execute])

  // handles if we render the suggestions or not
  useEffect(() => {
    if (userQuery === '') {
      setDisplaySuggestions(false)
      return
    }
    setDisplaySuggestions(true)
  }, [userQuery, setDisplaySuggestions])

  // Handles data normalization
  useLayoutEffect(() => {
    if (data === undefined) return

    const users = data.allActiveUsers.edges.map(user => user.node)
    setSearchResults(users)
  }, [data, setSearchResults])

  // === Handlers ===
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

  const handleIncrement = useCallback(
    (value: number, inc: -1 | 1) => {
      return clamp(value + inc, 0, searchResults.length - 1)
    },
    [searchResults]
  )

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (searchResults.length === 0) return
      const { code } = evt
      const sanitizedCursor = cursor === null ? -1 : cursor

      switch (code) {
        case 'ArrowUp':
          setCursor(handleIncrement(sanitizedCursor, -1))
          break
        case 'ArrowDown':
          setCursor(handleIncrement(sanitizedCursor, +1))
          break
        case 'Enter':
          const { id } = searchResults[sanitizedCursor]
          handleSelectUser(id)
          break
      }
    },
    [searchResults, cursor, handleSelectUser, handleIncrement]
  )

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
