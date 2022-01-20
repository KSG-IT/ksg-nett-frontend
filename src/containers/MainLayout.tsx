import { AuthRoutes } from 'containers//AuthRoutes'
import { Header } from 'modules/header'
import { Sidebar } from 'modules/sidebar'
import { useState } from 'react'
import styled, { css } from 'styled-components'
import { useRenderMobile } from 'util/isMobile'
interface WrapperProps {
  sidebarOpen: boolean
}

const Wrapper = styled.div<WrapperProps>`
  display: grid;
  width: 100%;
  grid-template-columns: 250px calc(100vw - 250px);
  grid-template-rows: 70px calc(100vh - 70px);
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
  height: calc(100vh - 70px);
`

const HeaderWrapper = styled.div`
  grid-area: header;
  width: 100%;
  height: 100%;
`

const SidebarWrapper = styled.div`
  grid-area: sidebar;
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
