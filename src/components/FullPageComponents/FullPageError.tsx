import { IconAlertTriangle } from '@tabler/icons'
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

export const FullPageError: React.VFC = () => {
  return (
    <Wrapper>
      <IconAlertTriangle size={200} />
      <Message>Noe gikk galt</Message>
    </Wrapper>
  )
}
