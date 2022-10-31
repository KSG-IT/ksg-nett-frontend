import { SimpleGrid } from '@mantine/core'
import { QuoteCard } from 'modules/quotes/components'
import { QuoteNode } from 'modules/quotes/types.graphql'

interface UserQuotesProps {
  quotes: QuoteNode[]
}

export const UserQuotes: React.FC<UserQuotesProps> = ({ quotes }) => {
  return (
    <SimpleGrid
      cols={2}
      py={'sm'}
      breakpoints={[
        { maxWidth: 'md', cols: 2, spacing: 'md' },
        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
      ]}
    >
      {quotes.map(quote => (
        <QuoteCard quote={quote} />
      ))}
    </SimpleGrid>
  )
}
