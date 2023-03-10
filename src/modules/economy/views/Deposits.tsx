import { useQuery } from '@apollo/client'
import {
  Button,
  Checkbox,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { IconRefresh, IconSearch } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { MessageBox } from 'components/MessageBox'
import { useState } from 'react'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { useDebounce } from 'util/hooks'
import { DepositsTable } from '../components/Deposits'
import { ALL_DEPOSITS } from '../queries'
import { AllDepositsQuery, AllDepositsVariables } from '../types.graphql'

const breadCrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Økonomi', path: '/economy' },
  { label: 'Innskudd', path: '' },
]

export const Deposits: React.FC = () => {
  const [unverifiedOnly, setUnverifiedOnly] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)

  const { data, loading, error, refetch } = useQuery<
    AllDepositsQuery,
    AllDepositsVariables
  >(ALL_DEPOSITS, {
    variables: {
      q: debouncedQuery,
      unverifiedOnly: unverifiedOnly,
      first: DEFAULT_PAGINATION_SIZE,
    },
    pollInterval: 30_000,
  })

  if (error) return <FullPageError />

  const deposits = data?.allDeposits.edges.map(edge => edge.node) ?? []

  return (
    <Stack>
      <Breadcrumbs items={breadCrumbItems} />
      <Group position="apart">
        <Title>Innskudd</Title>
        <Button
          color="samfundet-red"
          leftIcon={<IconRefresh />}
          onClick={() => refetch()}
        >
          Oppdater
        </Button>
      </Group>
      <MessageBox type="warning">
        Innskudd av typen ´Stripe` er ikke mulig å underkjenne eller godkjenne
        manuelt.
      </MessageBox>
      <Paper p="md" mb="sm" mt="sm">
        <Group align="center">
          <TextInput
            value={query}
            onChange={evt => setQuery(evt.target.value)}
            icon={<IconSearch />}
            placeholder="Søk etter bruker..."
          />
          <Checkbox
            label="Bare ikke godkjente"
            checked={unverifiedOnly}
            onChange={() => setUnverifiedOnly(!unverifiedOnly)}
          />
        </Group>
      </Paper>
      <DepositsTable deposits={deposits} queryLoading={loading} />
    </Stack>
  )
}
