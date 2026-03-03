import { SimpleGrid, Stack, Text } from '@mantine/core'
import { QuoteCard } from 'modules/quotes/components'
import { QuoteNode } from 'modules/quotes/types.graphql'

interface UserQuotesProps {
  quotes: Pick<
    QuoteNode,
    'text' | 'tagged' | 'id' | 'context' | 'sum' | 'semester'
  >[]
}

export const RecentQuotes: React.FC<UserQuotesProps> = ({ quotes }) => {
  const cards = quotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)
  return (
    <Stack>
      <Text c={'dimmed'} fw={700}>
        Siste sitater
      </Text>
      <SimpleGrid cols={{ base: 1, md: 2 }}>{cards}</SimpleGrid>
    </Stack>
  )
}
