import styled from 'styled-components'

const Wrapper = styled.header`
  background-color: hotpink;
  z-index: 9000;
`

interface HeaderProps {
  toggleSidebar: () => void
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <Wrapper>
      <button onClick={toggleSidebar}>toggle</button>
    </Wrapper>
  )
}
