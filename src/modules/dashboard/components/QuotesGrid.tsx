import {
  Avatar,
  Card,
  createStyles,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { QuoteNode } from 'modules/quotes/types'
import { UserThumbnail } from 'modules/users/components/UserThumbnail'

interface UserQuotesProps {
  quotes: Pick<QuoteNode, 'text' | 'tagged' | 'id' | 'context'>[]
}

export const RecentQuotes: React.FC<UserQuotesProps> = ({ quotes }) => {
  const { classes } = useStyles()
  const fields = quotes.map(quote => (
    <Card className={classes.card} key={quote.id} shadow={'xs'}>
      <Card.Section p={'sm'}>
        <Text size={'sm'} className={classes.quoteText}>
          {quote.text}
        </Text>
        <Avatar.Group spacing={5}>
          {quote.tagged.map(user => (
            <UserThumbnail size={'sm'} key={user.id} user={user} />
          ))}
        </Avatar.Group>
        <Text size={'xs'} color={'gray'}>
          {quote.context}
        </Text>
      </Card.Section>
    </Card>
  ))
  return (
    <Stack>
      <Text color={'dimmed'} weight={700}>
        Siste sitater
      </Text>
      <SimpleGrid
        mt={'sm'}
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
        ]}
      >
        {fields}
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
