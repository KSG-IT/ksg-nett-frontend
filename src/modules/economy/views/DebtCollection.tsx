import { useQuery } from '@apollo/client'
import { Stack, Text, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserShiftCardList } from 'modules/schedules/components'
import { MY_UPCOMING_SHIFTS } from 'modules/schedules/queries'
import { MyUpcomingShiftsReturns } from 'modules/schedules/types.graphql'
import { useCurrencyFormatter, useMe } from 'util/hooks'
import { CreateDepositInfoBox, DebtCollectionDepositForm } from '../components'

export const DebtCollection: React.FC = () => {
  const me = useMe()
  const { data, loading, error } =
    useQuery<MyUpcomingShiftsReturns>(MY_UPCOMING_SHIFTS)
  const { formatCurrency } = useCurrencyFormatter()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { myUpcomingShifts } = data

  return (
    <Stack p="lg">
      <Title>Hei, {me.firstName}!</Title>
      <Title order={3}>Din saldo: {formatCurrency(me.balance)}</Title>

      <Text>
        Du skylder penger.Her har du mulighet til å se vakter, men ikke noe
        annet. For å få tilgang til resten av siden må du opprertte et innskudd
        og få det godkjent.
      </Text>
      <CreateDepositInfoBox />
      <Title order={2}>Opprett innskudd</Title>
      {/* <DebtCollectionDepositForm /> */}
      <Title order={2}>Kommende vakter</Title>
      <UserShiftCardList shifts={myUpcomingShifts} />
    </Stack>
  )
}
