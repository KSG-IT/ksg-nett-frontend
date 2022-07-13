import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  color: ${props => props.theme.colors.gray1};
`

const Message = styled.h2`
  font-size: 28px;
  font-weight: 600;
`

export const FullPageRestricted: React.VFC = () => {
  return (
    <Wrapper>
      <FontAwesomeIcon size="6x" icon="exclamation-triangle" type="brand" />
      <Message>Du har tilgang til denne ressursen.</Message>
    </Wrapper>
  )
}
