import { Card, Container, createStyles, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { MessageBox } from 'components/MessageBox'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'util/hooks'
import { CreateDepositForm } from '../components'

const breadCrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Min økonomi', path: '/economy/me' },
  { label: 'Innskudd', path: '/economy/deposits/create' },
]

interface DepositProps {}

export const CreateDeposit: React.FC<DepositProps> = () => {
  const { classes } = useStyles()
  const mobileSize = useMediaQuery('(max-width: 600px)')
  const navigate = useNavigate()
  return (
    <Container size={'sm'} p={mobileSize ? 0 : 'xl'}>
      <Breadcrumbs items={breadCrumbItems} />
      <Title
        my={'xs'}
        transform="uppercase"
        className={classes.title}
        order={3}
      >
        Legg til innskudd
      </Title>
      <MessageBox type="info">
        Her kan du opprette et nytt innskudd på kontoen din. Bankoverføringer
        kan gjøres til <b>1503.88.72882</b> eller du kan betale med vipps. Velg
        "kjøp noe/betal til" og søk <b>95034</b>, da får du opp Societeten. Ved
        bruk av vipps er det gebyr på 5%, altså 5kr per 100kr du vil sende.
      </MessageBox>
      <Card radius={'md'} withBorder className={classes.card}>
        <CreateDepositForm
          onCompletedCallback={() => navigate('/economy/me')}
        />
      </Card>
    </Container>
  )
}

const useStyles = createStyles(theme => ({
  title: {
    color: theme.colors.gray[6],
    fontWeight: 'bold',
  },
  card: {
    borderTop: `5px solid ${theme.colors.brand}`,
    margin: `${theme.spacing.sm}px 0`,
  },
}))
