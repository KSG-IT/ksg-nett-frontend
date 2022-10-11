import { createStyles, Navbar, Text } from '@mantine/core'
import {
  IconAffiliate,
  IconBlockquote,
  IconCalendarTime,
  IconCreditCard,
  IconDisabled,
  IconEdit,
  IconHome,
  IconPhoto,
  IconQuestionMark,
  IconReportMoney,
  IconShoppingCart,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons'
import { useLocation } from 'react-router-dom'
import { useStore } from 'store'
import { NavBarMeSection } from './NavBarMeSection'
import { NavItem, RouteItem } from './NavItem'

interface RouteGroup {
  title: string
  items: RouteItem[]
}

const routes: RouteGroup[] = [
  {
    title: 'Generelt',
    items: [
      { icon: IconHome, link: '/dashboard', label: 'Kontrollpanel' },
      { icon: IconDisabled, link: '/events', label: 'Arrangement' },
      { icon: IconEdit, link: '/summaries', label: 'Møtereferater' },
      {
        icon: IconAffiliate,
        link: '/internal-groups',
        label: 'Interngjenger',
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
      },
      { icon: IconQuestionMark, link: '/quiz', label: 'Quiz' },
      { icon: IconPhoto, link: '/gallery', label: 'Galleri' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { icon: IconCalendarTime, link: '/schedules', label: 'Vaktlister' },
      { icon: IconUsers, link: '/users/manage', label: 'Personal' },
      {
        icon: IconUserPlus,
        link: '/admissions',
        label: 'Opptak',
      },
      {
        icon: IconCreditCard,
        link: '/economy/deposits',
        label: 'Innskudd',
      },
      {
        icon: IconShoppingCart,
        link: '/economy/soci-products',
        label: 'Soci produker',
      },
      {
        icon: IconReportMoney,
        link: '/economy/soci-sessions',
        label: 'Krysselister',
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

  const { classes } = useNavbarStyles()

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!isOpen}
      width={{ sm: 200, lg: 250 }}
      style={{ backgroundColor: 'white', overflowY: 'scroll' }}
    >
      <NavBarMeSection />
      {routes.map((routeGroup, index) => (
        <div className={classes.group} key={index}>
          <Text weight={600} mb="xs">
            {routeGroup.title}
          </Text>
          {routeGroup.items.map((item, index) => (
            <NavItem
              {...item}
              active={location.pathname === item.link}
              key={index}
            />
          ))}
        </div>
      ))}
    </Navbar>
  )
}

const useNavbarStyles = createStyles(t => ({
  group: {
    paddingBottom: t.spacing.sm,
  },
}))
