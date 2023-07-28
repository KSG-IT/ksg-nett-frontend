import { createStyles, Stack, Text } from '@mantine/core'
import {
  IconBabyCarriage,
  IconCreditCard,
  IconEdit,
  IconMeat,
  IconMoodKid,
  IconQuote,
} from '@tabler/icons-react'
import { ShortcutCard, ShortcutCardGrid } from 'components/ShortcutCard'
import { useMemo } from 'react'
import { PERMISSIONS } from 'util/permissions'

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
    title: 'Nytt referat',
    icon: IconEdit,
    color: 'samfundet-red',
    link: '/summaries/create',
    permissions: [PERMISSIONS.summaries.add.summary],
  },
]

interface ShortcutCardsProps {
  sociOrderSession: boolean
  showNewbies: boolean
}

export const ShortcutCards: React.FC<ShortcutCardsProps> = ({
  sociOrderSession,
  showNewbies,
}) => {
  const { classes } = useStyles()

  const memoizedShortcuts = useMemo(() => {
    if (showNewbies) {
      return [
        ...shortcuts,
        {
          title: 'De nye',
          icon: IconMoodKid,
          color: 'samfundet-red',
          link: '/users/newbies',
        },
      ]
    } else {
      return shortcuts
    }
  }, [showNewbies])

  return (
    <Stack>
      <Text color="dimmed" className={classes.title}>
        Snarveier
      </Text>

      {sociOrderSession && (
        <ShortcutCard
          title="Stilletime"
          icon={IconMeat}
          color="samfundet-red"
          link="/economy/soci-sessions/live"
        />
      )}

      <ShortcutCardGrid shortcuts={memoizedShortcuts} />
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
  },
}))
