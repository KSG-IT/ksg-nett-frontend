import { createStyles, Navbar, Text } from '@mantine/core'
import {
  IconAffiliate,
  IconBlockquote,
  IconBook2,
  IconCalendarTime,
  IconClipboardList,
  IconCreditCard,
  IconEdit,
  IconFlag,
  IconHandMiddleFinger,
  IconHome,
  IconMessage,
  IconTrophyFilled,
  IconUserPlus,
} from '@tabler/icons-react'
import { useLocation } from 'react-router-dom'
import { useStore } from 'store'
import { usePermissions } from 'util/hooks/usePermissions'
import { PERMISSIONS } from 'util/permissions'
import { NavBarMeSection } from './NavBarMeSection'
import { NavItem, RouteItem } from './NavItem'
import { IconTrophy } from '@tabler/icons-react'

interface RouteGroup {
  title: string
  items: RouteItem[]
}

const routes: RouteGroup[] = [
  {
    title: 'Generelt',
    items: [
      {
        icon: IconHome,
        link: '/dashboard',
        label: 'Kontrollpanel',
        permissions: [],
      },
      // {
      //   icon: IconMessage,
      //   link: '/forum',
      //   label: 'Forum',
      //   permissions: [],
      // },
      {
        icon: IconBook2,
        link: '/handbook',
        label: 'Håndboka',
        permissions: [],
      },
      {
        icon: IconEdit,
        link: '/summaries',
        label: 'Møtereferater',
        permissions: [],
      },
      {
        icon: IconAffiliate,
        link: '/internal-groups',
        label: 'Interngjenger',
        permissions: [],
      },
    ],
  },
  {
    title: 'Underholdning',
    items: [
      {
        icon: IconBlockquote,
        link: '/quotes',
        label: 'Sitater',
        permissions: [],
      },
      {
        icon: IconTrophy,
        link: '/economy/ranked',
        label: 'Ledertavle',
        permissions: [],
      },
    ],
  },
  {
    title: 'Admin',
    items: [
      {
        icon: IconCalendarTime,
        link: '/schedules',
        label: 'Vaktlister',
        permissions: PERMISSIONS.schedules.view.schedule,
      },
      {
        icon: IconUserPlus,
        link: '/admissions',
        label: 'Orvik',
        permissions: PERMISSIONS.admissions.view.admission,
      },
      {
        icon: IconHandMiddleFinger,
        link: '/users/user-types',
        label: 'Tilganger',
        permissions: PERMISSIONS.users.change.userType,
      },
      {
        icon: IconCreditCard,
        link: '/economy',
        label: 'Økonomi',
        permissions: PERMISSIONS.economy.view.sociSession,
      },
      {
        icon: IconClipboardList,
        link: '/economy/soci-sessions/live',
        label: 'Stilletime',
        permissions: PERMISSIONS.economy.add.sociOrderSession,
      },
      {
        icon: IconFlag,
        link: 'feature-flags',
        label: 'Feature flags',
        permissions: PERMISSIONS.featureFlags.view.featureFlag,
      },
    ],
  },
]

interface AppNavbarProps {
  opened: boolean
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ opened }) => {
  const location = useLocation()
  const isOpen = useStore(state => state.sidebarOpen)
  const { hasPermissions } = usePermissions()

  const { classes } = useNavbarStyles()

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!isOpen}
      width={{ sm: 200, lg: 250 }}
      style={{
        backgroundColor: 'white',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        fontSize: '12px',
      }}
    >
      <NavBarMeSection />
      {routes.map((routeGroup, index) => {
        const hasAny = routeGroup.items.some(item =>
          hasPermissions(item.permissions)
        )
        if (!hasAny) return null
        return (
          <div className={classes.group} key={index}>
            <Text weight={600} mb="xs" id={routeGroup.title}>
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
    </Navbar>
  )
}

const useNavbarStyles = createStyles(t => ({
  group: {
    paddingBottom: t.spacing.sm,
  },
}))
