import { createStyles, Paper, Table, TableProps } from '@mantine/core'

interface CardTableProps extends TableProps {
  p?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string
}

export const CardTable: React.FC<CardTableProps> = ({
  children,
  className,
  p = 'sm',
  ...rest
}) => {
  const { classes } = useCardTableStyles()

  return (
    <Paper className={`${classes.card} ${className}`} p={p}>
      <Table {...rest}>{children}</Table>
    </Paper>
  )
}

const useCardTableStyles = createStyles(theme => ({
  card: {
    overflowX: 'scroll',
  },
}))
