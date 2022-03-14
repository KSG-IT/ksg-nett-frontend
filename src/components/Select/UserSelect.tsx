import { useQuery } from '@apollo/client'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
  ALL_ACTIVE_USERS_SHALLOW_QUERY,
} from 'modules/users'
import Select from 'react-select'
import styled from 'styled-components'

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
  setUserCallback: (slectedId: string) => void
}
export interface SelectOption {
  label: string
  value: string
}

export const UserSelect: React.VFC<UserSelectProps> = ({
  userId,
  width = '400px',
  fullwidth = false,
  setUserCallback,
}) => {
  const { loading, data } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_SHALLOW_QUERY)

  const options: SelectOption[] =
    data?.allActiveUsers.edges.map(({ node }) => ({
      label: node.fullName,
      value: node.id,
    })) || []

  const initialValue = options.find(option => option.value == userId)

  return (
    <Wrapper fullwidth={fullwidth} width={width}>
      <Select
        isLoading={loading}
        defaultValue={initialValue}
        options={options}
        onChange={option => option && setUserCallback(option.value)}
        styles={{ container: () => ({ width: '100%' }) }}
      />
    </Wrapper>
  )
}
