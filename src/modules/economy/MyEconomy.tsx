import styled from 'styled-components'
import { useAuth } from 'context/Authentication'
import { BankAccountActivity, DepositNode, MY_BANK_ACCOUNT_QUERY } from '.'
import { CREATE_DEPOSIT } from './mutations'
import { useMutation, useQuery } from '@apollo/client'
import { numberWithSpaces } from 'util/parsing'
import format from 'date-fns/format'
import { useState } from 'react'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const AccountActivityCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadow.default};
  padding: 15px;
`

const AccountActivityEntry = styled.div`
  display: flex;
  flex-direction: row;
`

const AccountCard = styled.div`
  display: grid;
  grid-template-areas:
    '. balance balance'
    'cardid cardid cardid';

  width: 300px;
  height: 100px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadow.default};
  padding: 15px;
`

const Cardnumber = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  grid-area: cardid;

  font-size: 16px;
  font-weight: 500;
`

const AccountBalance = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  grid-area: balance;

  font-size: 20px;
  font-weight: 500;
`

export const MyEconomy = () => {
  const user = useAuth()
  const { data } = useQuery(MY_BANK_ACCOUNT_QUERY) // Consider just doing everything in the user query?
  const [depositAmount, setDepositAmount] = useState(0)
  const [createDeposit] = useMutation(CREATE_DEPOSIT, {
    refetchQueries: ['Me', 'MyBankAccount'],
    variables: {
      input: {
        description: '',
        amount: depositAmount,
        account: data?.myBankAccount?.id,
      },
    },
  })

  return (
    <Wrapper>
      Hei, {user.fullName}
      <AccountCard>
        <Cardnumber>
          Kortnummer: {numberWithSpaces(data?.myBankAccount?.cardUuid)}
        </Cardnumber>
        <AccountBalance>
          Balanse: {numberWithSpaces(user.balance)},- NOK
        </AccountBalance>
      </AccountCard>
      <AccountActivityCard>
        Kontoaktivitet
        {data?.myBankAccount?.user?.bankAccountActivity.map(
          (activity: BankAccountActivity, i: number) => (
            <AccountActivityEntry key={i}>
              <span>{activity.name} </span>
              <span>{activity.quantity} </span>
              <span>{activity.amount} ,- NOK</span>
              <span>
                Date: {format(new Date(activity.timestamp), 'dd.mm.yy')}
              </span>
            </AccountActivityEntry>
          )
        )}
      </AccountActivityCard>
      <AccountActivityCard>
        Innskudd
        {data?.myBankAccount?.deposits.map(
          (deposit: DepositNode, i: number) => (
            <AccountActivityEntry key={i}>
              <span>{deposit.amount},- NOK </span>
              <span>{deposit.approved ? 'Godkjent' : 'Ikke godkjent'}</span>
            </AccountActivityEntry>
          )
        )}
        <input
          value={depositAmount}
          onChange={evt => {
            setDepositAmount(parseInt(evt.target.value))
          }}
        />
        <button
          onClick={() => {
            createDeposit()
          }}
        >
          Lag innskudd
        </button>
      </AccountActivityCard>
    </Wrapper>
  )
}
