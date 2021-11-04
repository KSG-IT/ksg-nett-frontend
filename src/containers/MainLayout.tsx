import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { ME_QUERY } from 'modules/users/queries'
import { AuthRoutes } from 'containers//AuthRoutes'
import { Sidebar } from 'modules/sidebar'
import { useAuth } from '../context/Authentication'
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
  const isMobile = useRenderMobile()

  if (loading) return <span>Loading</span>

  if (error) return <span>Error {error.message}</span>

  return (
    <Wrapper sidebarOpen={true}>
      <SidebarProvider>
        <SidebarWrapper>
          <Sidebar />
        </SidebarWrapper>
      </SidebarProvider>
      <HeaderWrapper>Hello {user.firstName}!</HeaderWrapper>
      <ContentWrapper>
        <AuthRoutes />
      </ContentWrapper>
    </Wrapper>
  )
}

export default MainLayout
