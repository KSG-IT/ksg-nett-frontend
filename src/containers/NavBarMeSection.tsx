import { Group, Navbar, Stack, Text } from '@mantine/core'
import {
  IconCashBanknote,
  IconJumpRope,
  IconLogout,
  IconPigMoney,
  IconUser,
} from '@tabler/icons'
import { UserThumbnail } from 'modules/users/components'
import { useStore } from 'store'
import { removeLoginToken } from 'util/auth'
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
  const me = useStore(store => store.user)

  function handleLogoutAlert() {
    if (confirm('Er du sikker på at du vil logge ut?')) {
      removeLoginToken()
      window.location.reload()
    }
  }

  return (
    <Navbar.Section>
      <Group>
        <UserThumbnail user={me} size="md" />
        <Stack spacing={0}>
          <Text style={{ textOverflow: 'ellipsis' }} size="xs">
            {me.getFullWithNickName}
          </Text>
          <Group spacing={0} align="center">
            <IconPigMoney size={16} />
            <Text size={'xs'} weight={500} color={liquidityColor(me.balance)}>
              {me.balance},- NOK
            </Text>
          </Group>
        </Stack>
      </Group>
      <NavItem
        label="Min profil"
        link={`/users/${me.id}`}
        icon={IconUser}
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
