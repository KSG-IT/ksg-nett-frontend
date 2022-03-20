import { useMutation, useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import format from 'date-fns/format'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useStore } from 'store'
import styled from 'styled-components'
import { numberWithSpaces } from 'util/parsing'
import * as yup from 'yup'
import {
  BankAccountActivity,
  CreateDepositMutationReturns,
  CreateDepositMutationVariables,
  DepositNode,
  MyBankAccountReturns,
  MY_BANK_ACCOUNT_QUERY,
} from '.'
import { CREATE_DEPOSIT } from './mutations'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
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

type DepositFormInput = {
  amount: number
  description: string
  receipt: FileList
}

export const MyEconomy = () => {
  const user = useStore(state => state.user)!

  let schema = yup.object().shape({
    amount: yup.number().required().min(1, 'Må være et positivt tall'),
    description: yup.string().notRequired(),
    receipt: yup.mixed().notRequired(),
    // see https://stackoverflow.com/questions/52427095/validating-file-presence-with-yup for validation
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<DepositFormInput>({ resolver: yupResolver(schema) })

  const { data, loading, error } = useQuery<MyBankAccountReturns>(
    MY_BANK_ACCOUNT_QUERY
  )

  const [createDeposit] = useMutation<
    CreateDepositMutationReturns,
    CreateDepositMutationVariables
  >(CREATE_DEPOSIT, {
    refetchQueries: ['Me', 'MyBankAccount'],
  })

  if (error) return <span>En feil oppstod...</span>

  if (loading || !data) return <span>Loading...</span>

  const onSubmit: SubmitHandler<DepositFormInput> = data => {
    const fileList = data.receipt
    const file = fileList[0]

    createDeposit({
      variables: {
        input: {
          amount: data.amount,
          description: data.description,
          receipt: file,
        },
      },
    })
    reset({ amount: 0, description: '', receipt: '' })
  }

  return (
    <Wrapper>
      Hei, {user.fullName}
      <AccountCard>
        <Cardnumber>
          Kortnummer: {numberWithSpaces(data.myBankAccount.cardUuid)}
        </Cardnumber>
        <AccountBalance>
          Balanse: {numberWithSpaces(user.balance)},- NOK
        </AccountBalance>
      </AccountCard>
      <AccountActivityCard>
        Kontoaktivitet
        {data.myBankAccount.user.bankAccountActivity.map(
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
        {data.myBankAccount.deposits.map((deposit: DepositNode, i: number) => (
          <AccountActivityEntry key={i}>
            <span>{deposit.amount},- NOK </span>
            <span>{deposit.approved ? 'Godkjent' : 'Ikke godkjent'}</span>
          </AccountActivityEntry>
        ))}
      </AccountActivityCard>
      <CreateDepositArea>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input {...register('amount')} />
          <div>{formErrors.amount?.message}</div>
          <textarea {...register('description')} />
          <input
            type="file"
            accept="image/png, image/jpeg"
            {...register('receipt')}
          />
          <button type="submit">Lag innskudd</button>
        </form>
      </CreateDepositArea>
    </Wrapper>
  )
}
