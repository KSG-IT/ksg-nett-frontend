import {
  Avatar,
  Card,
  createStyles,
  Group,
  SimpleGrid,
  Text,
} from '@mantine/core'
import { QuoteCard } from 'modules/quotes'
import { QuoteNode } from 'modules/quotes/types'
import { UserThumbnail } from './UserThumbnail'

const useStyles = createStyles(theme => ({
  quoteText: {
    lineHeight: 1.1,
    fontWeight: 'bold',
  },
  quoteContext: {
    color: theme.colors.gray[6],
    lineHeight: 1.1,
    fontStyle: 'italic',
    margin: '0.5rem 0',
  },
  card: {
    maxWidth: 400,
  },
}))

interface UserQuotesProps {
  quotes: QuoteNode[]
}

export const UserQuotes: React.FC<UserQuotesProps> = ({ quotes }) => {
  const { classes } = useStyles()

  return (
    <SimpleGrid cols={2} py={'sm'}>
      {quotes.map(quote => (
        <QuoteCard quote={quote} />
      ))}
    </SimpleGrid>
  )
}
