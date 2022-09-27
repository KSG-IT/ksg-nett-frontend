import { Avatar, Card, createStyles, SimpleGrid, Text } from '@mantine/core'
import { QuoteNode } from 'modules/quotes/types'
import { UserThumbnail } from './UserThumbnail'

const useStyles = createStyles(theme => ({
  quoteText: {
    color: theme.colors.gray[7],
    fontStyle: 'italic',
  },
  card: {
    maxWidth: 400,
  },
}))

interface UserQuotesProps {
  quotes: QuoteNode[]
}

export const UserQuotes: React.VFC<UserQuotesProps> = ({ quotes }) => {
  const { classes } = useStyles()

  const fields = quotes.map(quote => (
    <Card className={classes.card} key={quote.id} radius="lg" shadow={'xs'}>
      <Card.Section p={'md'}>
        <Text className={classes.quoteText}>{quote.text}</Text>
        <Avatar.Group pt={'xs'}>
          {quote.tagged.map(user => (
            <UserThumbnail key={user.id} user={user} />
          ))}
        </Avatar.Group>
      </Card.Section>
    </Card>
  ))

  return (
    <SimpleGrid cols={2} p="md">
      {fields}
    </SimpleGrid>
  )
}
