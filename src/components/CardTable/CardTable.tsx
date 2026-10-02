import { Paper, Table, TableProps } from '@mantine/core'
import { createStyles } from '@mantine/emotion'

interface CardTableProps extends TableProps {
  p?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string
  compact?: boolean
}

export const CardTable: React.FC<CardTableProps> = ({
  children,
  className,
  p = 'sm',
  compact = false,
  ...rest
}) => {
  const { classes } = useCardTableStyles()

  return (
    <Paper className={`${classes.card} ${className}`} p={p}>
      <Table.ScrollContainer minWidth={0}>
        <Table fz={compact ? 12 : 14} {...rest}>
          {children}
        </Table>
      </Table.ScrollContainer>
    </Paper>
  )
}

const useCardTableStyles = createStyles(() => ({
  card: {
    td: {
      whiteSpace: 'nowrap',
    },
  },
}))
