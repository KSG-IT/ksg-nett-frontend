import { useQuery } from '@apollo/client'
import { ALL_ACTIVE_USERS_SHALLOW_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import Select from 'react-select'
import styled from 'styled-components'
import { UserOption, usersToSelectOption } from 'util/user'

interface WrapperProps {
  fullwidth: boolean
  width: string
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  width: ${props => (props.fullwidth ? '100%' : props.width)};
  position: relative;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow.default};
  margin: 0;

  ${props => props.theme.media.mobile} {
    width: 100%;
  }
`
interface UserSelectProps {
  userId?: string
  fullwidth?: boolean
  width?: string
  setUserCallback: (slectedId: UserOption) => void
}

export const UserSelect: React.FC<UserSelectProps> = ({
  userId,
  width = '400px',
  fullwidth = false,
  setUserCallback,
}) => {
  const { loading, data } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_SHALLOW_QUERY)

  const options = usersToSelectOption(data?.allActiveUsersList)
  const initialValue = options.find(option => option.value == userId)

  return (
    <Wrapper fullwidth={fullwidth} width={width}>
      <Select
        isLoading={loading}
        defaultValue={initialValue}
        options={options}
        onChange={option => option && setUserCallback(option)}
        styles={{ container: () => ({ width: '100%' }) }}
      />
    </Wrapper>
  )
}
