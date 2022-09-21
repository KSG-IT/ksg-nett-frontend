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
  TablerIcon,
} from '@tabler/icons'
import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NavBarMeSection } from './NavBarMeSection'

interface AppNavbarProps {
  opened: boolean
}
interface RouteGroup {
  title: string
  items: RouteItem[]
}

interface RouteItem {
  label: string
  link: string
  icon: TablerIcon
  onClick?: () => void
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

export const NavItem: FC<RouteItem & { active: boolean }> = props => {
  const { classes, cx } = useNavItemStyles({ active: props.active })
  return (
    <Link to={props.link} className={classes.navItem} onClick={props.onClick}>
      <props.icon className={cx(classes.icon)} data-active={props.active} />
      <Text className={classes.text}>{props.label}</Text>
    </Link>
  )
}

export const AppNavbar = ({ opened }: AppNavbarProps) => {
  const location = useLocation()

  const { classes } = useNavbarStyles()

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
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

const useNavItemStyles = createStyles((t, { active }: { active: boolean }) => ({
  icon: {
    color: active ? t.colors.white : t.colors.gray[6],
    marginRight: t.spacing.sm,
  },
  text: {
    fontWeight: 600,
    color: active ? t.colors.white : t.colors.gray[6],
  },
  navItem: {
    display: 'flex',
    width: '100%',
    borderRadius: t.radius.sm,
    padding: `${t.spacing.xs}px ${t.spacing.sm}px`,
    backgroundColor: active ? t.colors.brand : t.colors.white,
    '&:hover': {
      backgroundColor: !active ? t.colors.red[0] : 'none',
    },
  },
}))

const useNavbarStyles = createStyles(t => ({
  group: {
    paddingBottom: t.spacing.sm,
  },
}))
