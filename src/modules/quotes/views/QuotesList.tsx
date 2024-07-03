import { Group, Stack, TextInput, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { useState } from 'react'
import { QuoteGrid } from '../components/QuoteGrid'
import { QuotesTabs } from '../components/QuotesTabs'

const breadCrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Sitater', path: '/quotes' },
]

export const QuotesList = () => {
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 200)
  /**
   * This view lags like crazy on search. Fix at some point
   */

  return (
    <Stack>
      <Breadcrumbs items={breadCrumbItems} />
      <Group justify="apart">
        <Title order={2} color="dimmed">
          Sitater
        </Title>
        <TextInput
          icon={<IconSearch />}
          placeholder="Søk etter innhold..."
          value={query}
          onChange={evt => setQuery(evt.target.value)}
          style={{
            width: 600,
          }}
        />
        <QuotesTabs />
      </Group>
      <QuoteGrid search={debouncedQuery} />
    </Stack>
  )
}
