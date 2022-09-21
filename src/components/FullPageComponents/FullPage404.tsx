import { IconSkull } from '@tabler/icons'
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

export const FullPage404: React.VFC = () => {
  return (
    <Wrapper>
      <IconSkull size={200} />
      <Message>Denne siden finnes ikke</Message>
    </Wrapper>
  )
}

export default FullPage404
