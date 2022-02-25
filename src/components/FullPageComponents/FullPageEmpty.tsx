import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: auto;
`

const NoQuotesContainer = styled.div`
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
      <NoQuotesContainer>
        <FontAwesomeIcon icon="battery-empty" size="3x" />
        Oi, her var det tomt.
      </NoQuotesContainer>
    </Wrapper>
  )
}
