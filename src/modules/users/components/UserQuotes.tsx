import {
  Avatar,
  Card,
  createStyles,
  Group,
  SimpleGrid,
  Text,
} from '@mantine/core'
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
        <Card className={classes.card} key={quote.id} radius="lg" shadow={'xs'}>
          <Card.Section p={'md'}>
            <Text className={classes.quoteText}>{quote.text}</Text>
            <Text className={classes.quoteContext}>{quote.context}</Text>
            <Group spacing={5}>
              {quote.tagged.map(user => (
                <UserThumbnail key={user.id} user={user} />
              ))}
            </Group>
          </Card.Section>
        </Card>
      ))}
    </SimpleGrid>
  )
}
