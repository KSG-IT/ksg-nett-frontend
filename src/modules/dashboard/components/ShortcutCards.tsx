import {
  Card,
  createStyles,
  MediaQuery,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
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
    title: 'Nytt innskudd',
    icon: IconCreditCard,
    color: 'samfundet-red',
    link: '/economy/deposits/create',
  },
  {
    title: 'Interngjeng',
    icon: IconUsers,
    color: 'samfundet-red',
    link: '/internal-groups',
  },
  {
    title: 'Legg til sitat',
    icon: IconQuote,
    color: 'samfundet-red',
    link: '/quotes/create',
  },
  {
    title: 'Mine vakter',
    icon: IconBriefcase,
    color: 'samfundet-red',
    link: '/schedules/me',
  },
  {
    title: 'Nytt referat',
    icon: IconEdit,
    color: 'samfundet-red',
    link: '/summaries/create',
  },
]

export const ShortcutCards: React.FC = () => {
  const { classes } = useStyles()

  return (
    <Stack spacing={0}>
      <Text color="dimmed" className={classes.title}>
        Snarveier
      </Text>
      <Card py={0} className={classes.card}>
        <SimpleGrid
          cols={5}
          my={'xl'}
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 2, spacing: 'sm' },
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
    paddingRight: theme.spacing.md,
    paddingLeft: theme.spacing.md,

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      padding: 0,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
  },
}))
