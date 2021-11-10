import styled, { css } from 'styled-components'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ME_QUERY } from 'modules/users/queries'
import { AuthRoutes } from 'containers//AuthRoutes'
import { Sidebar } from 'modules/sidebar'
import { Header } from 'modules/header'
import { useRenderMobile } from 'util/isMobile'
interface WrapperProps {
  sidebarOpen: boolean
}

const Wrapper = styled.div<WrapperProps>`
  display: grid;
  width: 100%;
  grid-template-columns: 300px auto;
  grid-template-rows: 80px auto;
  grid-template-areas:
    'sidebar header'
    'sidebar main';

  ${props => props.theme.media.mobile} {
    display: flex;
    flex-direction: column;
    ${props =>
      props.sidebarOpen &&
      css`
        overflow-y: auto;
      `};
  }
`

interface ContentWrapperProps {
  visible: boolean
}

const ContentWrapper = styled.div<ContentWrapperProps>`
  grid-area: main;
  display: ${props => (props.visible ? 'none' : 'flex')};
  background-color: ${props => props.theme.colors.background};
`

const HeaderWrapper = styled.div`
  grid-area: header;
  width: 100%;
  height: 100%;
`

const SidebarWrapper = styled.div`
  grid-area: sidebar;
  background-color: green;
`

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useRenderMobile()

  const shouldNotRenderContent = isMobile && sidebarOpen

  const toggleSidebarCallback = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Wrapper sidebarOpen={true}>
      <HeaderWrapper>
        <Header toggleSidebar={toggleSidebarCallback}></Header>
      </HeaderWrapper>
      <SidebarWrapper>
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebarCallback={toggleSidebarCallback}
        />
      </SidebarWrapper>
      <ContentWrapper visible={shouldNotRenderContent}>
        <AuthRoutes />
      </ContentWrapper>
    </Wrapper>
  )
}

export default MainLayout
