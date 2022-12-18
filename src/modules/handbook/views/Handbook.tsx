import { Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { MessageBox } from 'components/MessageBox'

const breadcrumbs = [
  { label: 'Home', path: '/' },
  { label: 'Handbook', path: '/handbook' },
]

const Handbook = () => {
  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />
      <Title>Håndboka</Title>
      <MessageBox type="info">Denne siden er ikke klar enda</MessageBox>
    </Stack>
  )
}

export default Handbook
