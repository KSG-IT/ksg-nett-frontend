import {
  Affix,
  AppShell,
  Burger,
  Button,
  Container,
  createStyles,
  Group,
  Header,
  Image,
  MediaQuery,
  Popover,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery, useScrollLock } from '@mantine/hooks'
import { UserSearch } from 'modules/header/UserSearch'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router-dom'
import { useStore } from 'store'
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
  const toggleSidebar = useStore(state => state.toggleSidebarOpen)
  const sidebarOpen = useStore(state => state.sidebarOpen)
  const { classes } = useStyles()
  const isMobile = useMediaQuery('(max-width: 750px)')
  const [, setScrollLocked] = useScrollLock()

  function handleToggle() {
    if (!sidebarOpen && isMobile) {
      // setScrollLocked(true)
      const main = document.querySelector('main')
      if (main) {
        main.style.display = 'none'
      }
    }

    if (sidebarOpen && isMobile) {
      // setScrollLocked(false)
      const main = document.querySelector('main')
      if (main) {
        main.style.display = 'block'
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
          '-webkit-overflow-scrolling': 'touch',
          overflowY: 'scroll',
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
        <Affix position={{ bottom: 20, right: 20 }}>
          <Popover>
            <Popover.Target>
              <Button
                color={'blue'}
                variant={'light'}
                radius={'xl'}
                size={'sm'}
              >
                Noe som ikke funker?
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size={'sm'}>
                Send inn feil eller mangler gjennom dette skjemaet!
              </Text>
              <Button
                variant={'subtle'}
                compact
                component={'a'}
                href={'https://forms.gle/6ofXcwWEKmB8JXWP6'}
                target="_blank"
              >
                Tilbakemeldingsskjema
              </Button>
            </Popover.Dropdown>
          </Popover>
        </Affix>
        {children}
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
  footer: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

export default MainLayout
