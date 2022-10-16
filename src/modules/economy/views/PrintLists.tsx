import { createStyles, List, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

export const PrintLists = () => {
  const { classes } = usePrintListsStyles()

  return (
    <div className={classes.wrapper}>
      <Title>Lister</Title>
      <List>
        <List.Item>
          <Link to="working-today">De som jobber i dag</Link>
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
