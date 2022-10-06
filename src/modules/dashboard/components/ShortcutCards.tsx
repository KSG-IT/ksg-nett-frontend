import { Card, createStyles, SimpleGrid, Stack, Text } from '@mantine/core'
import {
  IconBriefcase,
  IconCreditCard,
  IconEdit,
  IconQuote,
  IconUsers,
} from '@tabler/icons'
import { ShortcutCardItem } from './ShortcutCardItem'

const shortcuts = [
  {
    title: 'Innskudd',
    icon: IconCreditCard,
    color: 'cyan',
    link: '/economy/me',
  },
  {
    title: 'Interngjeng',
    icon: IconUsers,
    color: 'indigo',
    link: '/internal-groups',
  },
  {
    title: 'Legg til sitat',
    icon: IconQuote,
    color: 'blue',
    link: '/quotes/create',
  },
  {
    title: 'Mine vakter',
    icon: IconBriefcase,
    color: 'violet',
    link: '/schedules/me',
  },
  {
    title: 'Nytt referat',
    icon: IconEdit,
    color: 'orange',
    link: '/summaries/create',
  },
]

export const ShortcutCards: React.FC = () => {
  const { classes } = useStyles()

  return (
    <Stack>
      <Text color="dimmed" className={classes.title}>
        Snarveier
      </Text>
      <Card p={0} radius="md" className={classes.card}>
        <SimpleGrid
          cols={5}
          my={'xl'}
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >
          {shortcuts.map(shortcut => (
            <ShortcutCardItem {...shortcut} />
          ))}
        </SimpleGrid>
      </Card>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.gray[0],
    minWidth: 400,
    minHeight: 150,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
  },
}))
