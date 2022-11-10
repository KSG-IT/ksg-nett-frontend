import { useQuery } from '@apollo/client'
import { Card, createStyles, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import styled from 'styled-components'
import {
  MyDeposits,
  MyExpenditures,
  MyPurchases,
  AccountCard,
} from '../components'
import { MY_BANK_ACCOUNT_QUERY } from '../queries'
import { MyBankAccountReturns } from '../types.graphql'

export const MyEconomy: React.FC = () => {
  const { classes } = useStyles()
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
      <Card withBorder className={classes.balanceCard}>
        <Title order={4}>Konto</Title>
        <AccountCard account={data.myBankAccount} />
      </Card>
      <Card withBorder className={classes.cardWithBorder}>
        <Title order={4}>Siste kontoaktivitet</Title>
        <MyPurchases activities={data.myBankAccount.user.lastTransactions} />
      </Card>
      <Card withBorder className={classes.card}>
        <Title order={4}>Forbruk</Title>
        <MyExpenditures moneySpent={data.myBankAccount.user.moneySpent} />
      </Card>
      <Card withBorder className={classes.cardWithBorder}>
        <Title order={4}>Innskudd</Title>
        <MyDeposits deposits={data.myBankAccount.lastDeposits} />
      </Card>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  cardWithBorder: {
    borderTop: `5px solid ${theme.colors.brand}`,
  },
  balanceCard: {
    backgroundColor: theme.colors['samfundet-red'][5],
    color: theme.white,
    maxWidth: 450,
  },
}))
