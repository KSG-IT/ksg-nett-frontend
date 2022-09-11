import {
  Anchor,
  AppShell,
  Burger,
  createStyles,
  Footer,
  Group,
  Header,
  Image,
  MediaQuery,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { AppRoutes } from 'routes'
import logoUrl from '../../assets/images/548spaghetti_100786.png'
import { AppNavbar } from './Navbar'

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
            </Group>
          </div>
        </Header>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppRoutes />
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
