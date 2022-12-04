import { Card, createStyles, SimpleGrid, Stack, Text } from '@mantine/core'
import {
  IconBabyCarriage,
  IconCalendarTime,
  IconCreditCard,
  IconEdit,
  IconMeat,
  IconQuote,
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
    title: 'Legg til sitat',
    icon: IconQuote,
    color: 'samfundet-red',
    link: '/quotes/create',
  },
  {
    title: 'Alle vakter',
    icon: IconBabyCarriage,
    color: 'samfundet-red',
    link: '/schedules/all-shifts',
  },
  {
    title: 'Tilgjengelighet',
    icon: IconCalendarTime,
    color: 'samfundet-red',
    link: '/schedules/me/availability',
  },
  {
    title: 'Nytt referat',
    icon: IconEdit,
    color: 'samfundet-red',
    link: '/summaries/create',
    permissions: ['summaries.add.summary'],
  },
]

interface ShortcutCardsProps {
  sociOrderSession: boolean
}

export const ShortcutCards: React.FC<ShortcutCardsProps> = ({
  sociOrderSession,
}) => {
  const { classes } = useStyles()

  return (
    <Stack spacing={0}>
      <Text color="dimmed" className={classes.title}>
        Snarveier
      </Text>
      <Stack px="md">
        <ShortcutCardItem
          title="Stilletime"
          icon={IconMeat}
          color="samfundet-red"
          link="/economy/soci-sessions/live"
        />
      </Stack>

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
          {shortcuts.map((shortcut, index) => (
            <ShortcutCardItem key={index} {...shortcut} />
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
