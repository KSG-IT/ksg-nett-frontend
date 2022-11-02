import { Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { Search } from 'components/Input'
import { useState } from 'react'
import { useDebounce } from 'util/hooks/useDebounce'
import { QuoteGrid } from '../components/QuoteGrid'
import { QuotesTabs } from '../components/QuotesTabs'

const breadCrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Sitater', path: '/quotes' },
]

export const QuotesList = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)

  return (
    <Stack>
      <Breadcrumbs items={breadCrumbItems} />
      <Group position="apart">
        <Title order={2} color="dimmed">
          Sitater
        </Title>
        <Search
          width={600}
          placeholder="Søk etter innhold..."
          value={query}
          onChange={setQuery}
        />
        <QuotesTabs />
      </Group>
      <QuoteGrid search={debouncedQuery} />
    </Stack>
  )
}
