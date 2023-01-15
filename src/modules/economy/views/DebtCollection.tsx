import { useQuery } from '@apollo/client'
import { Stack, Text, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserShiftCardList } from 'modules/schedules/components'
import { MY_UPCOMING_SHIFTS } from 'modules/schedules/queries'
import { MyUpcomingShiftsReturns } from 'modules/schedules/types.graphql'
import { useMe } from 'util/hooks'
import { CreateDepositForm, CreateDepositInfoBox } from '../components'

export const DebtCollection: React.FC = () => {
  const me = useMe()
  const { data, loading, error } =
    useQuery<MyUpcomingShiftsReturns>(MY_UPCOMING_SHIFTS)

  const numberFrmt = new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { myUpcomingShifts } = data

  return (
    <Stack p="lg">
      <Title>Hei, {me.firstName}!</Title>
      <Title order={3}>Din saldo: {numberFrmt.format(me.balance)}</Title>

      <Text>
        Du skylder penger.Her har du mulighet til å se vakter, men ikke noe
        annet. For å få tilgang til resten av siden må du opprertte et innskudd
        og få det godkjent.
      </Text>
      <CreateDepositInfoBox />
      <CreateDepositForm onCompletedCallback={() => {}} />
      <Title order={2}>Kommende vakter</Title>
      <UserShiftCardList shifts={myUpcomingShifts} />
    </Stack>
  )
}
