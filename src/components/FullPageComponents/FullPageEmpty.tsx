import { IconHourglassEmpty } from '@tabler/icons'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  color: ${props => props.theme.colors.gray2};
  font-size: 28px;
  font-weight: 600;
`
export const FullPageEmpty: React.VFC = () => {
  return (
    <Wrapper>
      <IconHourglassEmpty size={200} />
      Oi, her var det tomt.
    </Wrapper>
  )
}
