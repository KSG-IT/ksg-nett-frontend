import { Avatar, Card, createStyles, SimpleGrid, Text } from '@mantine/core'
import { QuoteNode } from 'modules/quotes/types'
import { UserThumbnail } from './UserThumbnail'

const useStyles = createStyles(theme => ({
  quoteText: {
    fontWeight: 'bold',
  },
  quoteContext: {
    color: theme.colors.gray[6],
    fontStyle: 'italic',
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
        <Card className={classes.card} key={quote.id} radius="lg" shadow={'xs'}>
          <Card.Section p={'md'}>
            <Text className={classes.quoteText}>{quote.text}</Text>
            <Text className={classes.quoteContext}>{quote.context}</Text>
            <Avatar.Group pt={'xs'}>
              {quote.tagged.map(user => (
                <UserThumbnail key={user.id} user={user} />
              ))}
            </Avatar.Group>
          </Card.Section>
        </Card>
      ))}
    </SimpleGrid>
  )
}
