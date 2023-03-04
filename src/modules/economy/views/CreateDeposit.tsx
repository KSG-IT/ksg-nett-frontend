import { gql, useQuery } from '@apollo/client'
import { Card, Container, createStyles, Tabs, Title } from '@mantine/core'
import { IconBuildingBank, IconCreditCard } from '@tabler/icons'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useMediaQuery } from 'util/hooks'
import { CreateDepositForm, CreateDepositInfoBox } from '../components'

const breadCrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Min økonomi', path: '/economy/me' },
  { label: 'Innskudd', path: '/economy/deposits/create' },
]

interface DepositProps {}

export const ONGOING_DEPOSIT_INTENT_QUERY = gql`
  query OngoingDepositIntent {
    ongoingDepositIntent {
      id
      amount
      resolvedAmount
      stripePaymentId
    }
  }
`

export const CreateDeposit: React.FC<DepositProps> = () => {
  const { classes } = useStyles()
  const mobileSize = useMediaQuery('(max-width: 600px)')

  const { data, loading, error } = useQuery(ONGOING_DEPOSIT_INTENT_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const onGoingIntent = data?.ongoingDepositIntent ?? null

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
      <CreateDepositInfoBox />

      <Card radius={'md'} withBorder className={classes.card}>
        <CreateDepositForm
          onCompletedCallback={() => {}}
          onGoingIntent={onGoingIntent}
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
