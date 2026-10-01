import { AppShell, Text } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useLocation } from 'react-router-dom'
import { useStore } from 'store'
import { usePermissions } from 'util/hooks/usePermissions'
import { NavBarMeSection } from './NavBarMeSection'
import { NavItem } from './NavItem'
import { useRouteGroups } from './useNavbarRoutes'

interface AppNavbarProps {
  opened: boolean
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ opened }) => {
  const routeGroups = useRouteGroups()

  const location = useLocation()
  const isOpen = useStore(state => state.sidebarOpen)
  const { hasPermissions } = usePermissions()

  const { classes } = useNavbarStyles()

  return (
    <AppShell.Navbar
      p="md"
      hidden={!isOpen}
      style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
    >
      <NavBarMeSection />
      {routeGroups.map((routeGroup, index) => {
        const hasAny = routeGroup.items.some(item =>
          hasPermissions(item.permissions)
        )
        if (!hasAny) return null
        return (
          <div className={classes.group} key={index}>
            <Text size="xs" fw={600} mb="xs" id={routeGroup.title}>
              {routeGroup.title}
            </Text>
            {routeGroup.items.map((item, index) => {
              return (
                <NavItem
                  {...item}
                  active={location.pathname === item.link}
                  key={index}
                />
              )
            })}
          </div>
        )
      })}
    </AppShell.Navbar>
  )
}

const useNavbarStyles = createStyles(t => ({
  group: {
    paddingBottom: t.spacing.sm,
  },
}))
