import { useQuery } from '@apollo/client'
import { ALL_INTERNAL_GROUPS_QUERY } from 'modules/organization/queries'
import { AllInternalGroupsReturns } from 'modules/organization/types'
import Select from 'react-select'
import styled from 'styled-components'
import { internalGroupToSelectOptions } from 'util/organization'

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
interface InternalGroupSelectProps {
  internalGroupId?: string
  fullwidth?: boolean
  width?: string
  setInternalGroupCallback: (slectedId: string) => void
}

export const InternalGroupSelect: React.VFC<InternalGroupSelectProps> = ({
  internalGroupId,
  fullwidth = false,
  width = '400px',
  setInternalGroupCallback,
}) => {
  const { loading, data } = useQuery<AllInternalGroupsReturns>(
    ALL_INTERNAL_GROUPS_QUERY
  )

  const options = internalGroupToSelectOptions(data?.allInternalGroups)
  const initialValue = options.find(option => option.value == internalGroupId)

  return (
    <Wrapper fullwidth={fullwidth} width={width}>
      <Select
        isLoading={loading}
        defaultValue={initialValue}
        options={options}
        // ToDo: Have groupings for internal and interest group
        onChange={option => option && setInternalGroupCallback(option.value)}
        styles={{ container: () => ({ width: '100%' }) }}
      />
    </Wrapper>
  )
}
