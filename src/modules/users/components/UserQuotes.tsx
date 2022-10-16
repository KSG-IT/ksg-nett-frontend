import { createStyles, SimpleGrid } from '@mantine/core'
import { QuoteCard } from 'modules/quotes/components'
import { QuoteNode } from 'modules/quotes/types'

interface UserQuotesProps {
  quotes: QuoteNode[]
}

export const UserQuotes: React.FC<UserQuotesProps> = ({ quotes }) => {
  return (
    <SimpleGrid cols={2} py={'sm'}>
      {quotes.map(quote => (
        <QuoteCard quote={quote} />
      ))}
    </SimpleGrid>
  )
}
