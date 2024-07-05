import { List, Title } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { Link } from 'react-router-dom'

const breadcrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Innkryssinger', path: '/economy/soci-sessions' },
  { label: 'Lister å printe', path: '/economy/print' },
]

export const PrintLists = () => {
  const { classes } = usePrintListsStyles()

  return (
    <div className={classes.wrapper}>
      <Breadcrumbs items={breadcrumbItems} />
      <Title>Lister</Title>
      <List>
        <List.Item>
          <Link to="/economy/soci-sessions/live">Digital stilletime</Link>
        </List.Item>
      </List>
    </div>
  )
}

const usePrintListsStyles = createStyles(theme => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
}))
