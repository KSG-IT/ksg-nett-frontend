import { useQuery } from '@apollo/client'
import { ALL_INTERNAL_GROUP_POSITIONS } from 'modules/organization/queries'
import { AllInternalGroupPositionsReturns } from 'modules/organization/types'
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
interface InternalGroupPositionSelectProps {
  internalGroupPositionId?: string
  fullwidth?: boolean
  width?: string
  setInternalGroupPositionCallback: (slectedId: string) => void
}

export const InternalGroupPositionSelect: React.VFC<
  InternalGroupPositionSelectProps
> = ({
  internalGroupPositionId,
  fullwidth = false,
  width = '400px',
  setInternalGroupPositionCallback,
}) => {
  const { loading, data } = useQuery<AllInternalGroupPositionsReturns>(
    ALL_INTERNAL_GROUP_POSITIONS
  )

  const options = internalGroupToSelectOptions(data?.allInternalGroupPositions)
  const initialValue = options.find(
    option => option.value == internalGroupPositionId
  )

  return (
    <Wrapper fullwidth={fullwidth} width={width}>
      <Select
        isLoading={loading}
        defaultValue={initialValue}
        options={options}
        // ToDo: Have groupings for internal and interest group
        onChange={option =>
          option && setInternalGroupPositionCallback(option.value)
        }
        styles={{ container: () => ({ width: '100%' }) }}
      />
    </Wrapper>
  )
}
