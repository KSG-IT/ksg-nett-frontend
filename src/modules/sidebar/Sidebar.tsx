import styled from 'styled-components'
import { useState, useContext } from 'react'
import { useRenderMobile } from 'util/isMobile'
import { SidebarContext } from 'context/SidebarContext'
import { ZIndexRange } from 'types/enums'

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  background-color: hotpink;
  z-index: ${ZIndexRange.Sidebar};
`

export const Sidebar = () => {
  const isMobile = useRenderMobile()
  const { open } = useContext(SidebarContext)

  const shouldRenderSidebar = isMobile && open
  console.log('sidebar')
  console.log(shouldRenderSidebar)

  return <Wrapper>Hi there</Wrapper>
}
