import { AppShell, Text } from '@mantine/core'
import { useLocation } from 'react-router-dom'
import { useStore } from 'store'
import { usePermissions } from 'util/hooks/usePermissions'
import { activeLink } from './activeLink'
import classes from './Navbar.module.css'
import { ME_ITEMS, NavBarMeSection } from './NavBarMeSection'
import { NavItem } from './NavItem'
import { RouteGroup, useRouteGroups } from './useNavbarRoutes'

interface AppNavbarProps {
  opened: boolean
}

export const AppNavbar: React.FC<AppNavbarProps> = () => {
  const routeGroups = useRouteGroups()
  const location = useLocation()
  const isOpen = useStore(state => state.sidebarOpen)
  const { hasPermissions } = usePermissions()

  const links = [...ME_ITEMS, ...routeGroups.flatMap(group => group.items)].map(
    item => item.link
  )
  const active = activeLink(location.pathname, links)
  const visibleGroups = routeGroups.filter(group =>
    group.items.some(item => hasPermissions(item.permissions))
  )

  return (
    <AppShell.Navbar hidden={!isOpen} className={classes.navbar}>
      <NavBarMeSection activeLink={active} />
      {visibleGroups.map(group => (
        <NavGroup key={group.title} group={group} activeLink={active} />
      ))}
    </AppShell.Navbar>
  )
}

interface NavGroupProps {
  group: RouteGroup
  activeLink: string | null
}

const NavGroup: React.FC<NavGroupProps> = ({ group, activeLink }) => (
  <nav className={classes.group} aria-labelledby={group.title}>
    <Text className={classes.groupTitle} id={group.title}>
      {group.title}
    </Text>
    {group.items.map(item => (
      <NavItem key={item.link} {...item} active={item.link === activeLink} />
    ))}
  </nav>
)
