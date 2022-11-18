import { useQuery } from '@apollo/client'
import { SimpleGrid, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  AccountCard,
  MyDeposits,
  MyExpenditures,
  MyPurchases,
} from '../components'
import { MY_BANK_ACCOUNT_QUERY } from '../queries'
import { MyBankAccountReturns } from '../types.graphql'

const breadCrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Min økonomi', path: '/economy/me' },
]

export const MyEconomy: React.VFC = () => {
  const { data, loading, error } = useQuery<MyBankAccountReturns>(
    MY_BANK_ACCOUNT_QUERY
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  return (
    <Stack>
      <Breadcrumbs items={breadCrumbItems} />
      <Title>Min økonomi</Title>
      <SimpleGrid cols={2}>
        <Stack>
          <Title order={2}>Konto</Title>
          <AccountCard account={data.myBankAccount} />
        </Stack>
        <Stack>
          <Title order={2}>Siste kontoaktivitet</Title>

          <MyPurchases activities={data.myBankAccount.user.lastTransactions} />
        </Stack>
        <Stack>
          <Title order={2}>Innskudd</Title>
          <MyDeposits deposits={data.myBankAccount.lastDeposits} />
        </Stack>
        <Stack>
          <Title order={2}>Forbruk</Title>
          <MyExpenditures moneySpent={data.myBankAccount.user.moneySpent} />
        </Stack>
      </SimpleGrid>
    </Stack>
  )
}
