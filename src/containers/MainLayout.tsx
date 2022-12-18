import {
  AppShell,
  Burger,
  Button,
  Container,
  createStyles,
  Group,
  Header,
  Image,
  MediaQuery,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { FullContentLoader } from 'components/Loading'
import { UserSearch } from 'modules/header/UserSearch'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router-dom'
import { lock, unlock } from 'tua-body-scroll-lock'
import { useIsMobile, useSidebar } from 'util/hooks'
import logoUrl from '../assets/images/548spaghetti_100786.png'
import { AppNavbar } from './Navbar'
interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <Container role="alert">
      <Text>Something went wrong:</Text>
      <Text>{error.message}</Text>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </Container>
  )
}

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useMantineTheme()
  const { sidebarOpen, toggleSidebar } = useSidebar()
  const { classes } = useStyles()
  const isMobile = useIsMobile()

  function handleToggle() {
    // An attempt to handle ios scroll context issue
    const main = document.querySelector('main')
    const nav = document.querySelector('nav')
    if (!sidebarOpen && isMobile) {
      if (main) {
        main.style.display = 'block'
        main.style.overflow = 'hidden'
        main.style.position = 'fixed'
        nav && (nav.style.overscrollBehaviorY = 'contain')
        // const scrollAnchoringPoint = document.getElementById('Generelt')
        // scrollAnchoringPoint && scrollAnchoringPoint.click()
      }
    }

    if (sidebarOpen && isMobile) {
      if (main) {
        main.style.display = 'block'
        main.style.overflow = 'auto'
        main.style.position = 'relative'
        nav && (nav.style.overscrollBehaviorY = 'auto')
      }
    }

    toggleSidebar()
  }

  return (
    <AppShell
      styles={{
        root: {
          fontFamily: 'Inter',
        },
        main: {
          background: theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<AppNavbar opened={sidebarOpen} />}
      header={
        <Header height={70} p="md">
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={sidebarOpen}
                onClick={handleToggle}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Group className={classes.header}>
              <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                <Group>
                  <Link to="/dashboard">
                    <Image src={logoUrl} width={48} height={48} />
                  </Link>
                  <Link to="/dashboard">
                    <Text weight={700} size="lg">
                      Kafe- og serveringsnett
                    </Text>
                  </Link>
                </Group>
              </MediaQuery>
              <UserSearch />
            </Group>
          </div>
        </Header>
      }
    >
      {/* Main content being rendered */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<FullContentLoader />}>{children}</Suspense>
      </ErrorBoundary>
    </AppShell>
  )
}

const useStyles = createStyles(t => ({
  header: {
    width: '100%',
    justifyContent: 'space-between',
    [`@media (max-width: ${t.breakpoints.sm}px)`]: {
      flexDirection: 'row-reverse',
    },
  },
}))

export default MainLayout
