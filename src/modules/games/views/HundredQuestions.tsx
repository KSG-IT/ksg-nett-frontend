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
    label: 'Hundre spørsmål',
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
