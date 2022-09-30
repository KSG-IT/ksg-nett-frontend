import {
  Card,
  createStyles,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import {
  IconBriefcase,
  IconChecklist,
  IconCreditCard,
  IconEdit,
  IconQuote,
  IconUsers,
  TablerIcon,
} from '@tabler/icons'
import { Link } from 'react-router-dom'

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
    color: 'grape',
    link: '/summaries/create',
  },
]

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

  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${theme.colors.gray[2]}`,
    textAlign: 'center',
    borderRadius: theme.radius.md,
    height: 90,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.white,
    transition: 'box-shadow 150ms ease, transform 100ms ease',

    '&:hover': {
      boxShadow: `${theme.shadows.md} !important`,
      transform: 'scale(1.05)',
    },
  },
}))

export const ShortcutCards: React.FC = () => {
  const { classes, theme } = useStyles()

  const items = shortcuts.map(({ icon: Icon, title, color, link }) => (
    <UnstyledButton
      component={Link}
      to={`${link}`}
      p={'lg'}
      key={title}
      className={classes.item}
    >
      <Icon color={theme.colors[color][6]} size={32} />
      <Text size={'sm'} color={'dimmed'} weight={800}>
        {title}
      </Text>
    </UnstyledButton>
  ))

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
          {items}
        </SimpleGrid>
      </Card>
    </Stack>
  )
}
