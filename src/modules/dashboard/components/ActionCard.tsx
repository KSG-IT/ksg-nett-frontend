import { IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Card,
  createStyles,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'

const shortcuts = [
  { title: 'Innskudd', icon: 'credit-card', color: 'cyan' },
  { title: 'Interngjeng', icon: 'users', color: 'indigo' },
  { title: 'Legg til sitat', icon: 'quote-left', color: 'blue' },
  { title: 'Mine vakter', icon: 'briefcase', color: 'violet' },
  { title: 'Nytt referat', icon: 'edit', color: 'grape' },
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
  itemTitle: {
    color: theme.black,
  },
}))

export function ActionsGrid() {
  const { classes, theme } = useStyles()

  const items = shortcuts.map(item => (
    <UnstyledButton p={'lg'} key={item.title} className={classes.item}>
      <FontAwesomeIcon
        icon={item.icon as IconName}
        color={theme.colors[item.color][5]}
      />
      <Text weight={400} mt={7} className={classes.itemTitle}>
        {item.title}
      </Text>
    </UnstyledButton>
  ))

  return (
    <Stack>
      <Text color="dimmed" className={classes.title}>
        Snarveier
      </Text>
      <Card withBorder radius="md" p={'lg'} className={classes.card}>
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
