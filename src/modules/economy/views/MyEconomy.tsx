import { gql, useQuery } from '@apollo/client'
import {
  ActionIcon,
  Anchor,
  Card,
  createStyles,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconExternalLink, IconRefresh } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import React from 'react'
import { useMe } from 'util/hooks'
import { TransactionCard } from '../../dashboard/components/TransactionCard'
import { AccountCard, MyDeposits, MyExpenditures } from '../components'
import { MY_BANK_ACCOUNT_QUERY } from '../queries'
import { MyBankAccountReturns } from '../types.graphql'

const breadCrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Min økonomi', path: '/economy/me' },
]

const DigiBong: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(
    gql`
      query {
        myExternalChargeQrCodeUrl
      }
    `,
    {
      fetchPolicy: 'network-only',
    }
  )

  if (error) return <FullPageError />

  if (loading || !data) return <span> Loading</span>

  const { myExternalChargeQrCodeUrl } = data

  return (
    <Group>
      <Anchor href={myExternalChargeQrCodeUrl} target="_blank">
        <Group spacing={0}>
          <Text>Digibong QR kode</Text>
          <IconExternalLink stroke={1.5} size={18} />
        </Group>
      </Anchor>
      <ActionIcon>
        <IconRefresh stroke={1.5} size={20} onClick={() => refetch()} />
      </ActionIcon>
    </Group>
  )
}

export const MyEconomy: React.FC = () => {
  const { classes } = useStyles()
  const { data, loading, error } = useQuery<MyBankAccountReturns>(
    MY_BANK_ACCOUNT_QUERY
  )

  const me = useMe()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  return (
    <Stack>
      <Breadcrumbs items={breadCrumbItems} />
      <Title>Min økonomi</Title>

      {me.isSuperuser && <DigiBong />}

      <AccountCard
        className={classes.balanceCard}
        account={data.myBankAccount}
      />
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: 'md', cols: 1, spacing: 'md' },
          { maxWidth: 'sm', cols: 1, spacing: 'sm' },
        ]}
      >
        <Stack>
          <Text color={'dimmed'} weight={700} p={'xs'}>
            Forbruk
          </Text>
          <Card withBorder className={classes.cardWithBorder}>
            <MyExpenditures moneySpent={data.myBankAccount.user.moneySpent} />
          </Card>
        </Stack>

        <TransactionCard
          activities={data.myBankAccount.user.lastTransactions}
        />
        <Stack>
          <Text color={'dimmed'} weight={700} p={'xs'}>
            Innskudd
          </Text>
          <Card withBorder className={classes.cardWithBorder}>
            <MyDeposits deposits={data.myBankAccount.lastDeposits} />
          </Card>
        </Stack>
      </SimpleGrid>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  cardWithBorder: {
    borderTop: `5px solid ${theme.colors.brand}`,
    '@media (max-width: 800px)': {
      padding: theme.spacing.xs,
    },
  },
  balanceCard: {
    backgroundImage: theme.fn.gradient({ from: 'cyan.8', to: 'cyan.4' }),
    color: theme.white,
    maxWidth: 450,
    maxHeight: 300,
    borderRadius: theme.radius.lg,
  },
}))
