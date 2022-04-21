import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import styled from 'styled-components'
import { MyBankAccountReturns, MY_BANK_ACCOUNT_QUERY } from '.'
import { AccountCard } from './AccountCard'
import { MyDeposits } from './MyDeposits'
import { MyExpenditures } from './MyExpenditures'
import { MyPurchases } from './MyPurchases'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: grid;
  grid-template-areas:
    'title .'
    'deposits account'
    'activity activity'
    'expenditure expenditure';
  grid-template-columns: 1fr 2fr;
  grid-gap: 10px;
  grid-template-rows: 70px auto auto auto;
  max-width: 900px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`
const Title = styled.h1`
  grid-area: title;
  margin: 0;
`

const SubTitle = styled.h2`
  margin: 0;
`

const AccountActivityCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadow.default};
  padding: 15px;
`

interface SectionProps {
  gridArea: string
}

const SectionContainer = styled.div<SectionProps>`
  display: flex;
  flex-direction: column;
  grid-area: ${props => props.gridArea};
  width: 100%;
  height: 100%;
  gap: 5px;
`

export const MyEconomy: React.VFC = () => {
  const { data, loading, error } = useQuery<MyBankAccountReturns>(
    MY_BANK_ACCOUNT_QUERY
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  return (
    <Wrapper>
      <Title>Min økonomi</Title>
      <SectionContainer gridArea="account">
        <SubTitle>Konto</SubTitle>
        <AccountCard account={data.myBankAccount} />
      </SectionContainer>
      <SectionContainer gridArea="activity">
        <SubTitle>Siste kontoaktivitet</SubTitle>
        <AccountActivityCard>
          <MyPurchases activities={data.myBankAccount.user.lastTransactions} />
        </AccountActivityCard>
      </SectionContainer>
      <SectionContainer gridArea="expenditure">
        <SubTitle>Forbruk</SubTitle>
        <MyExpenditures />
      </SectionContainer>
      <SectionContainer gridArea="deposits">
        <SubTitle>Innskudd</SubTitle>
        <MyDeposits deposits={data.myBankAccount.lastDeposits} />
      </SectionContainer>
    </Wrapper>
  )
}
