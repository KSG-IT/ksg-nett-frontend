import {
  AppShell,
  Badge,
  Burger,
  Button,
  Container,
  Group,
  Image,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { FullContentLoader } from 'components/Loading'
import { WhatsNewNotification } from 'components/WhatsNewNotification'
import { UserSearch } from 'modules/header/UserSearch'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router-dom'
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
  const isMobile = useIsMobile()
  const { sidebarOpen, toggleSidebar } = useSidebar()
  const { classes } = useStyles()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !sidebarOpen },
      }}
      padding="md"
      styles={{
        root: {
          fontFamily: 'Inter',
        },
        main: {
          background: theme.colors.gray[0],
        },
      }}
    >
      <AppShell.Header p="md">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {isMobile && (
            <Burger
              className={classes.mobileOnly}
              opened={sidebarOpen}
              onClick={toggleSidebar}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          )}
          <Group className={classes.header}>
            {!isMobile && (
              <Group>
                <Link to="/dashboard">
                  <Image src={logoUrl} width={48} height={48} />
                </Link>
                <Link to="/dashboard">
                  <Text fw={700} size="lg">
                    Kafe- og serveringsnett
                  </Text>
                </Link>
                <a
                  target="_blank"
                  href="https://github.com/KSG-IT/ksg-nett-frontend/blob/develop/CHANGELOG.md"
                >
                  <Badge color="gray">v{APP_VERSION}</Badge>
                </a>
              </Group>
            )}
            <UserSearch />
          </Group>
        </div>
      </AppShell.Header>
      <AppNavbar opened={sidebarOpen} />
      <AppShell.Main>
        {/* Main content being rendered */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<FullContentLoader />}>{children}</Suspense>
        </ErrorBoundary>
        <WhatsNewNotification />
      </AppShell.Main>
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

  mobileOnly: {
    [`@media (max-width: ${t.breakpoints.sm}px)`]: {
      display: 'none',
    },
  },
}))

export default MainLayout
