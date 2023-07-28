import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  UnstyledButton,
  createStyles,
} from '@mantine/core'
import { IconMoodSmile } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { formatDistanceToNow } from 'util/date-fns'

const ForumThread: React.FC = () => {
  const { classes } = useStyles()
  return (
    <Stack spacing="xs">
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/dashboard' },
          { label: 'Forum', path: '/forum' },
          { label: 'KSG-IT har opptak!', path: '' },
        ]}
      />
      <Title>KSG-IT har opptak!</Title>
      <Text style={{ fontSize: 12 }}>
        Av <b>Alexander Orvik</b>, {formatDistanceToNow(new Date())}
      </Text>

      <Card>
        <p>asd</p>
        <p>asijd</p>
        <Group>
          <UnstyledButton className={classes.addReactButton}>
            <IconMoodSmile />
          </UnstyledButton>
        </Group>
      </Card>
    </Stack>
  )
}
const useStyles = createStyles(theme => ({
  addReactButton: {
    backgroundColor: theme.colors.red[8],
    color: theme.colors.red[0],
    '&hover': {
      backgroundColor: theme.colors.red[9],
    },
  },
}))
export default ForumThread
