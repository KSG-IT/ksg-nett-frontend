import { SimpleGrid } from '@mantine/core'
import { QuoteCard } from 'modules/quotes/components'
import { QuoteNode } from 'modules/quotes/types.graphql'

interface UserQuotesProps {
  quotes: QuoteNode[]
}

export const UserQuotes: React.FC<UserQuotesProps> = ({ quotes }) => {
  return (
    <SimpleGrid
      py={'sm'}
      cols={{ base: 2, lg: 4 }}
      spacing={{ base: 10, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}
    >
      {quotes.map(quote => (
        <QuoteCard displaySemester quote={quote} key={quote.id} />
      ))}
    </SimpleGrid>
  )
}
