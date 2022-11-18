import {
  Avatar,
  Card,
  createStyles,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { QuoteCard } from 'modules/quotes/components'
import { QuoteNode } from 'modules/quotes/types.graphql'
import { UserThumbnail } from 'modules/users/components/UserThumbnail'

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
      <Text color={'dimmed'} weight={700}>
        Siste sitater
      </Text>
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: 'md', cols: 1, spacing: 'md' },
          { maxWidth: 'sm', cols: 1, spacing: 'sm' },
        ]}
      >
        {cards}
      </SimpleGrid>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  quoteText: {
    color: theme.colors.gray[7],
    fontStyle: 'italic',
  },
  card: {
    maxWidth: 200,
  },
}))
