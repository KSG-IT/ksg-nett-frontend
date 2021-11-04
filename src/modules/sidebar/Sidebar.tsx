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

interface SidebarProps {
  sidebarOpen: boolean
  toggleSidebarCallback: () => void
}

export const Sidebar = ({
  sidebarOpen,
  toggleSidebarCallback,
}: SidebarProps) => {
  const isMobile = useRenderMobile()

  const shouldRenderSidebar = !isMobile || sidebarOpen
  console.log('sidebar')
  console.log(shouldRenderSidebar)

  return <div>{shouldRenderSidebar && <Wrapper>Hi there</Wrapper>}</div>
}
