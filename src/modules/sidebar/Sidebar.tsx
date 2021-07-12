import styled from 'styled-components'
import { useState } from 'react'

interface WrapperProps {
  open: boolean
}

const Wrapper = styled.div<WrapperProps>`
  height: 100vh;
  width: ${props => (props.open ? '360px' : 0)};
  background-color: red;
`

export const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false)

  return <Wrapper open={sidebar}></Wrapper>
}
