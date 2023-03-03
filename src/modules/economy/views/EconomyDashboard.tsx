import { Stack, Title } from '@mantine/core'
import {
  IconBabyCarriage,
  IconBaguette,
  IconCreditCard,
  IconEdit,
  IconQuote,
} from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { ShortcutCardGrid } from 'components/ShortcutCard'
import { PERMISSIONS } from 'util/permissions'

const shortcuts = [
  {
    title: 'Innskudd',
    icon: IconCreditCard,
    color: 'samfundet-red',
    link: '/economy/deposits',
    permissions: [PERMISSIONS.economy.change.deposit],
  },
  {
    title: 'BSF',
    icon: IconBaguette,
    color: 'samfundet-red',
    link: '/bar-tab',
  },
  {
    title: 'Innkryssinger',
    icon: IconBabyCarriage,
    color: 'samfundet-red',
    link: 'soci-sessions',
  },
]

const EconomyDashboard = () => {
  return (
    <Stack>
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/' },
          { label: 'Økonomi', path: '/economy' },
        ]}
      />
      <Title>Økonomi</Title>
      <ShortcutCardGrid shortcuts={shortcuts} />
    </Stack>
  )
}

export default EconomyDashboard
