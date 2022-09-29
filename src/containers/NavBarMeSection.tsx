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

  return (
    <Navbar.Section>
      <Group>
        <UserThumbnail user={me} />
        <Stack spacing={0}>
          <Text>{me.fullName}</Text>
          <Group spacing={0} align="center">
            <IconPigMoney />
            <Text size={'md'} weight={500} color={liquidityColor(me.balance)}>
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
      />
      <NavItem
        label="Min Økonomi"
        link="/economy/me"
        icon={IconCashBanknote}
        active={false}
      />
      <NavItem
        label="Min vaktplan"
        link="/schedules/me"
        icon={IconJumpRope}
        active={false}
      />
      <NavItem
        label="Logg ut"
        link="/"
        icon={IconLogout}
        active={false}
        onClick={() => {
          removeLoginToken()
          window.location.reload()
        }}
      />
    </Navbar.Section>
  )
}
