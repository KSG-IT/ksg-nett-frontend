import { AppShell, Text, UnstyledButton } from '@mantine/core'
import * as Sentry from '@sentry/react'
import {
  IconCashBanknote,
  IconHandRock,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react'
import { UserThumbnail } from 'modules/users/components'
import { useNavigate } from 'react-router-dom'
import { useStore } from 'store'
import { removeLoginToken } from 'util/auth'
import { useCurrencyFormatter, useSidebar } from 'util/hooks'
import classes from './Navbar.module.css'
import { NavItem, RouteItem } from './NavItem'

// Before: 100–1000 kr was 'white', which was invisible on the white sidebar.
function liquidityColor(balance: number) {
  if (balance < 0) return 'red.7'
  if (balance < 100) return 'orange.7'
  if (balance < 1000) return 'dimmed'
  return 'teal.7'
}

export const ME_ITEMS: RouteItem[] = [
  {
    label: 'Innstillinger',
    link: '/users/me',
    icon: IconSettings,
    permissions: [],
  },
  {
    label: 'Min økonomi',
    link: '/economy/me',
    icon: IconCashBanknote,
    permissions: [],
  },
  {
    label: 'Mine vakter',
    link: '/schedules/me',
    icon: IconHandRock,
    permissions: [],
  },
]

interface NavBarMeSectionProps {
  activeLink: string | null
}

export const NavBarMeSection: React.FC<NavBarMeSectionProps> = ({
  activeLink,
}) => {
  const me = useStore(store => store.user)
  const { formatCurrency } = useCurrencyFormatter()
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate()

  function handleLogoutAlert() {
    if (confirm('Er du sikker på at du vil logge ut?')) {
      removeLoginToken()
      Sentry.setUser(null)
      window.location.reload()
    }
  }

  function handleClick() {
    toggleSidebar()
    navigate(`/users/${me.id}`)
  }

  return (
    <AppShell.Section className={classes.group}>
      <UnstyledButton className={classes.me} onClick={handleClick}>
        <UserThumbnail user={me} />
        <div className={classes.meText}>
          <Text size="sm" fw={600} truncate>
            {me.getFullWithNickName}
          </Text>
          <Text
            size="xs"
            fw={600}
            c={liquidityColor(me.balance)}
            className={classes.balance}
          >
            {formatCurrency(me.balance)}
          </Text>
        </div>
      </UnstyledButton>
      <MeItems activeLink={activeLink} />
      <NavItem
        label="Logg ut"
        link="#"
        icon={IconLogout}
        active={false}
        permissions={[]}
        onClick={handleLogoutAlert}
      />
    </AppShell.Section>
  )
}

const MeItems: React.FC<NavBarMeSectionProps> = ({ activeLink }) => (
  <>
    {ME_ITEMS.map(item => (
      <NavItem key={item.link} {...item} active={item.link === activeLink} />
    ))}
  </>
)
