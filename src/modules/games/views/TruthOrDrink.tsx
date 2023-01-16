import { Stack } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'

const breadCrumbItems = [
  {
    label: 'Home',
    path: '/dashboard',
  },
  {
    label: 'Sprell',
    path: '/games',
  },
  {
    label: 'Truth or drink',
    path: '',
  },
]

const TruthOrDrink: React.FC = () => {
  return (
    <Stack>
      <Breadcrumbs items={breadCrumbItems} />
    </Stack>
  )
}

export default TruthOrDrink
