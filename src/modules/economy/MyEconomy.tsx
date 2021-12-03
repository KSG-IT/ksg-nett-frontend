import styled from 'styled-components'
import { useAuth } from 'context/Authentication'
import { BankAccountActivity, DepositNode, MY_BANK_ACCOUNT_QUERY } from '.'
import { CREATE_DEPOSIT } from './mutations'
import { useMutation, useQuery } from '@apollo/client'
import { numberWithSpaces } from 'util/parsing'
import format from 'date-fns/format'
import { useRef, useState } from 'react'

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

const CreateDepositArea = styled.div`
  display: flex;
  flex-direction: row;
  width: 600px;
  height: 35px;
`

export const MyEconomy = () => {
  const user = useAuth()
  const [depositReceipt, setDepositReceipt] = useState<File | null>(null)
  const [depositDescription, setDepositDescription] = useState('')
  const [depositAmount, setDepositAmount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data } = useQuery(MY_BANK_ACCOUNT_QUERY) // Consider just doing everything in the user query?
  const [createDeposit] = useMutation(CREATE_DEPOSIT, {
    variables: {
      input: {
        description: depositDescription,
        amount: depositAmount,
        account: data?.myBankAccount?.id,
        receipt: depositReceipt,
      },
      refetchQueries: ['Me', 'MyBankAccount'],
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return
    setDepositReceipt(file)
  }

  const submitHandler = () => {
    createDeposit()
    setDepositReceipt(null)
    setDepositDescription('')
    setDepositAmount(0)
    fileInputRef.current = null
  }

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
      </AccountActivityCard>
      <CreateDepositArea>
        <input
          value={depositAmount}
          onChange={evt => {
            setDepositAmount(parseInt(evt.target.value))
          }}
        />
        <textarea
          value={depositDescription}
          onChange={e => setDepositDescription(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} ref={fileInputRef} />
        <button onClick={submitHandler}>Lag innskudd</button>
      </CreateDepositArea>
    </Wrapper>
  )
}
