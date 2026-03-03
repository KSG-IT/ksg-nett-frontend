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
  const { classes } = useCardTableStyles({ compact })

  return (
    <Paper className={`${classes.card} ${className}`} p={p}>
      <Table fz={compact ? 12 : 14} {...rest}>
        {children}
      </Table>
    </Paper>
  )
}

interface CardTableStyleProps {
  compact: boolean
}

const useCardTableStyles = createStyles(
  (theme, { compact }: CardTableStyleProps) => ({
    card: {
      overflowX: 'scroll',
      overflowY: 'scroll',
      td: {
        whiteSpace: 'nowrap',
        tr: {
          fontSize: compact ? '12px' : '16px',
        },
      },
    },
  })
)
