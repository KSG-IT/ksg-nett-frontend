import { useQuery } from '@apollo/client'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
  ALL_ACTIVE_USERS_SHALLOW_QUERY,
} from 'modules/users'
import Select from 'react-select'
import styled from 'styled-components'
import { usersToSelectOption } from 'util/user'

interface WrapperProps {
  fullwidth: boolean
  width: string
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${props => (props.fullwidth ? '100%' : props.width)};
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 10px;

  box-shadow: ${props => props.theme.shadow.default};
  ${props => props.theme.media.mobile} {
    width: 100%;
  }
`

interface UserMultiSelectProps {
  users?: string[]
  width?: string
  fullwidth?: boolean
  setUsersCallback: (users: string[]) => void
}
export const UserMultiSelect: React.VFC<UserMultiSelectProps> = ({
  users = [],
  width = '400px',
  fullwidth = false,
  setUsersCallback,
}) => {
  const { data, loading } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_SHALLOW_QUERY)

  const options = usersToSelectOption(data?.allActiveUsers)

  const initialValue = options.filter(option => users.includes(option.value))

  return (
    <Wrapper fullwidth={fullwidth} width={width}>
      <Select
        closeMenuOnSelect={false}
        isMulti={true}
        isLoading={loading}
        defaultValue={initialValue}
        options={options}
        onChange={options =>
          setUsersCallback(options.map(option => option.value))
        }
      />
    </Wrapper>
  )
}
