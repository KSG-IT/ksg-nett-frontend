import styled from 'styled-components'

const Wrapper = styled.div`
  margin: auto;
  font-size: 28px;
  font-weight: 600;
`

export const FullContentLoader: React.VFC = () => {
  return <Wrapper>LOADING...</Wrapper>
}
