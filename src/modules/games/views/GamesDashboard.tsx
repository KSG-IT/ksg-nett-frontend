import { Stack, Title } from '@mantine/core'
import { IconBeer, IconBinary, IconNumber, IconNumber2 } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { ShortcutCardGrid } from 'components/ShortcutCard'

const shortcuts = [
  {
    title: 'Truth or drink',
    icon: IconBeer,
    color: 'samfundet-red',
    link: 'truth-or-drink',
  },
  {
    title: 'Hundre spørsmål',
    icon: IconBinary,
    color: 'samfundet-red',
    link: 'hundred-questions',
  },
]

const breadCrumbItems = [
  {
    label: 'Home',
    path: '/dashboard',
  },
  {
    label: 'Sprell',
    path: '/games',
  },
]

const GamesDashboard: React.FC = () => {
  return (
    <Stack>
      <Breadcrumbs items={breadCrumbItems} />
      <Title>Sprell</Title>
      <ShortcutCardGrid shortcuts={shortcuts} />
    </Stack>
  )
}

export default GamesDashboard
