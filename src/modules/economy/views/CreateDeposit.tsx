import { Card, Container, createStyles, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'util/hooks'
import { CreateDepositForm } from '../components'

interface DepositProps {}

const useStyles = createStyles(theme => ({
  title: {
    color: theme.colors.gray[6],
    fontWeight: 'bold',
  },
  card: {
    borderTop: `5px solid ${theme.colors.brand}`,
  },
}))

export const CreateDeposit: React.FC<DepositProps> = () => {
  const { classes } = useStyles()
  const mobileSize = useMediaQuery('(max-width: 600px)')
  const navigate = useNavigate()
  return (
    <Container size={'sm'} p={mobileSize ? 0 : 'xl'}>
      <Title
        my={'lg'}
        transform="uppercase"
        className={classes.title}
        order={3}
      >
        Legg til innskudd
      </Title>
      <Card radius={'md'} withBorder className={classes.card}>
        <CreateDepositForm
          onCompletedCallback={() => navigate('/economy/deposits')}
        />
      </Card>
    </Container>
  )
}
