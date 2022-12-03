import { Card, createStyles, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { InternalGroupNode } from '../types'

interface InternalGroupCardProps {
  internalGroup: InternalGroupNode
}

export const InternalGroupCard: React.FC<InternalGroupCardProps> = ({
  internalGroup,
}) => {
  const navigate = useNavigate()
  const { classes } = useStyles()
  return (
    <Card
      className={classes.card}
      onClick={() => {
        navigate(`/internal-groups/${internalGroup.id}`)
      }}
    >
      <Title order={3}>{internalGroup.name}</Title>
    </Card>
  )
}

const useStyles = createStyles(theme => ({
  card: {
    display: 'flex',
    height: '100px',
    alignItems: 'center',

    boxShadow: theme.shadows.sm,
    ':hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.lightGray,
      transform: 'scale(0.98)',
    },
  },
}))
