import {
  Anchor,
  AppShell,
  Burger,
  Button,
  Container,
  createStyles,
  Footer,
  Group,
  Header,
  Image,
  MediaQuery,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { UserSearch } from 'modules/header/UserSearch'
import React, { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
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
  const [opened, setOpened] = useState(false)
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
      navbar={<AppNavbar opened={opened} />}
      footer={
        <Footer height={60} p="md" className={classes.footer}>
          <Text>
            Har du funnet en feil på nettsiden? Ta kontakt med
            <Anchor href="mailto:ksg-it@samfundet.no"> KSG - IT </Anchor>
          </Text>
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened(o => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Group className={classes.header}>
              <Image src={logoUrl} width={48} height={48} />
              <Text weight={700} size="lg">
                Kafe- og serveringsnett
              </Text>

              <UserSearch />
            </Group>
          </div>
        </Header>
      }
    >
      {/* Main content being rendered */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {children}
      </ErrorBoundary>
    </AppShell>
  )
}

const useStyles = createStyles(t => ({
  header: {
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
