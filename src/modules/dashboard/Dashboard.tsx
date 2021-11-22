import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px 18px;
`

const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: space-between;
`

interface CardProps {
  width: string
  height: string
}

const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  width: ${props => props.width};
  height: ${props => props.height};
  margin: 0 20px;
  background-color: ${props => props.theme.colors.white};
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow.default};
`
const CardTitle = styled.h3`
  margin: 0;
`

const TransactionSpan = styled.div`
  display: inline-flex;
  justify-content: space-between;
  margin-top: 10px;
`

// open events on top
// area for messages if need be
//

export const Dashboard = () => {
  return (
    <Wrapper>
      <CardRow>
        <Card width="450px" height="300px">
          <CardTitle>Siste transaksjoner</CardTitle>
          <TransactionSpan>
            <span>29.11</span>
            <span>Tuborg</span>
            <span>6</span>
            <span>25 kr</span>
            <span>150 kr</span>
          </TransactionSpan>
          <TransactionSpan>
            <span>29.11</span>
            <span>Tuborg</span>
            <span>6</span>
            <span>25 kr</span>
            <span>150 kr</span>
          </TransactionSpan>{' '}
          <TransactionSpan>
            <span>29.11</span>
            <span>Tuborg</span>
            <span>6</span>
            <span>25 kr</span>
            <span>150 kr</span>
          </TransactionSpan>{' '}
          <TransactionSpan>
            <span>29.11</span>
            <span>Tuborg</span>
            <span>6</span>
            <span>25 kr</span>
            <span>150 kr</span>
          </TransactionSpan>{' '}
          <TransactionSpan>
            <span>29.11</span>
            <span>Tuborg</span>
            <span>6</span>
            <span>25 kr</span>
            <span>150 kr</span>
          </TransactionSpan>{' '}
          <TransactionSpan>
            <span>29.11</span>
            <span>Tuborg</span>
            <span>6</span>
            <span>25 kr</span>
            <span>150 kr</span>
          </TransactionSpan>
        </Card>
        <Card width="450px" height="300px">
          test
        </Card>
      </CardRow>
    </Wrapper>
  )
}
