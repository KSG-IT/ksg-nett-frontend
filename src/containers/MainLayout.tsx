import styled from 'styled-components'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ME_QUERY } from 'modules/users/queries'
import { AuthRoutes } from 'containers//AuthRoutes'
import { Sidebar } from 'modules/sidebar'
import { useAuth } from '../context/Authentication'
import { Header } from 'modules/header'
import { useMobile, useRenderMobile, useViewport } from 'util/isMobile'
import { SidebarProvider } from 'context/SidebarContext'
interface WrapperProps {
  sidebarOpen: boolean
}

const Wrapper = styled.div<WrapperProps>`
  display: grid;
  grid-template-columns: 300px auto;
  grid-template-rows: 80px auto;
  grid-template-areas:
    'sidebar header'
    'sidebar main';
`

const ContentWrapper = styled.div`
  grid-area: main;
  background-color: lightblue;
`

const HeaderWrapper = styled.div`
  grid-area: header;
  background-color: blue;
`

const SidebarWrapper = styled.div`
  grid-area: sidebar;
  background-color: green;
`

const MainLayout: React.FC = () => {
  const { loading, error } = useQuery(ME_QUERY)
  const user = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useRenderMobile()

  const toggleSidebarCallback = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) return <span>Loading</span>

  if (error) return <span>Error {error.message}</span>

  return (
    <Wrapper sidebarOpen={true}>
      <SidebarWrapper>
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebarCallback={toggleSidebarCallback}
        />
      </SidebarWrapper>
      <HeaderWrapper>
        <Header toggleSidebar={toggleSidebarCallback}></Header>
      </HeaderWrapper>
      <ContentWrapper>
        <AuthRoutes />
      </ContentWrapper>
    </Wrapper>
  )
}

export default MainLayout
