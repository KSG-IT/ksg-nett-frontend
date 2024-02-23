import {
  AppShell,
  Badge,
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
import { useSidebar } from 'util/hooks'
import logoUrl from '../assets/images/548spaghetti_100786.png'
import { AppNavbar } from './Navbar'
import { WhatsNewNotification } from 'components/WhatsNewNotification'
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
                onClick={toggleSidebar}
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
                  <a
                    target="_blank"
                    href="https://github.com/KSG-IT/ksg-nett-frontend/blob/develop/CHANGELOG.md"
                  >
                    <Badge style={{ color: 'black' }} color="gray">
                      v{APP_VERSION}
                    </Badge>
                  </a>
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
      <WhatsNewNotification />
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
