import { Card, createStyles, Stack, Text } from '@mantine/core'
import {
  IconBabyCarriage,
  IconCreditCard,
  IconEdit,
  IconMeat,
  IconQuote,
} from '@tabler/icons'
import { ShortcutCard, ShortcutCardGrid } from 'components/ShortcutCard'
import { PERMISSIONS } from 'util/permissions'

const shortcuts = [
  {
    title: 'Nytt innskudd',
    icon: IconCreditCard,
    link: '/economy/deposits/create',
  },
  {
    title: 'Legg til sitat',
    icon: IconQuote,
    link: '/quotes/create',
  },
  {
    title: 'Alle vakter',
    icon: IconBabyCarriage,
    link: '/schedules/all-shifts',
  },
  {
    title: 'Nytt referat',
    icon: IconEdit,
    link: '/summaries/create',
    permissions: [PERMISSIONS.summaries.add.summary],
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
    <Stack>
      <Text color="dimmed" className={classes.title}>
        Snarveier
      </Text>
      <Card p={0}>
        {sociOrderSession && (
          <ShortcutCard
            title="Stilletime"
            icon={IconMeat}
            link="/economy/soci-sessions/live"
          />
        )}
      </Card>
      <ShortcutCardGrid shortcuts={shortcuts} />
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
  },
}))
