import { AuthRoutes } from 'containers//AuthRoutes'
import { Header } from 'modules/header'
import { Sidebar } from 'modules/sidebar'
import { ErrorBoundary } from 'react-error-boundary'
import { useStore } from 'store'
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

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}
const ErrorFallback: React.VFC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const MainLayout: React.FC = () => {
  const sidebarOpen = useStore(state => state.sidebarOpen)
  const toggleSidebarOpen = useStore(state => state.toggleSidebarOpen)
  const isMobile = useRenderMobile()

  const shouldNotRenderContent = isMobile && sidebarOpen

  return (
    <Wrapper sidebarOpen={true}>
      <HeaderWrapper>
        <Header toggleSidebar={toggleSidebarOpen}></Header>
      </HeaderWrapper>
      <SidebarWrapper>
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebarCallback={toggleSidebarOpen}
        />
      </SidebarWrapper>
      <ContentWrapper visible={shouldNotRenderContent}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthRoutes />
        </ErrorBoundary>
      </ContentWrapper>
    </Wrapper>
  )
}

export default MainLayout
