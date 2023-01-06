import { createStyles, Group, Navbar, Stack, Text } from '@mantine/core'
import {
  IconCashBanknote,
  IconJumpRope,
  IconLogout,
  IconPigMoney,
  IconSettings,
} from '@tabler/icons'
import { UserThumbnail } from 'modules/users/components'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from 'store'
import { removeLoginToken } from 'util/auth'
import { useSidebar } from 'util/hooks'
import { NavItem } from './NavItem'

function liquidityColor(balance: number) {
  if (balance < 0) {
    return 'red'
  } else if (balance < 100) {
    return 'yellow'
  } else if (balance < 1000) {
    return 'white'
  } else {
    return 'cyan'
  }
}

export const NavBarMeSection: React.FC = () => {
  const { classes } = useStyles()
  const me = useStore(store => store.user)
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate()

  function handleLogoutAlert() {
    if (confirm('Er du sikker på at du vil logge ut?')) {
      removeLoginToken()
      window.location.reload()
    }
  }

  function handleClick() {
    toggleSidebar()
    navigate(`/users/${me.id}`)
  }

  return (
    <Navbar.Section>
      <Group className={classes.meGroup} onClick={handleClick}>
        <UserThumbnail user={me} size="md" />

        <Stack spacing={0}>
          <Text style={{ textOverflow: 'ellipsis' }} size="xs">
            {me.getFullWithNickName}
          </Text>
          <Group spacing={0} align="center">
            <IconPigMoney size={16} />
            <Text size={'xs'} weight={500} color={liquidityColor(me.balance)}>
              {me.balance} kr
            </Text>
          </Group>
        </Stack>
      </Group>
      <NavItem
        label="Innstillinger"
        link={`/users/me`}
        icon={IconSettings}
        active={false}
        permissions={[]}
      />
      <NavItem
        label="Min Økonomi"
        link="/economy/me"
        icon={IconCashBanknote}
        active={false}
        permissions={[]}
      />
      <NavItem
        label="Min vaktplan"
        link="/schedules/me"
        icon={IconJumpRope}
        active={false}
        permissions={[]}
      />
      <NavItem
        label="Logg ut"
        link="#"
        icon={IconLogout}
        active={false}
        permissions={[]}
        onClick={handleLogoutAlert}
      />
    </Navbar.Section>
  )
}

const useStyles = createStyles(() => ({
  meGroup: {
    ':hover': {
      cursor: 'pointer',
    },
  },
}))
