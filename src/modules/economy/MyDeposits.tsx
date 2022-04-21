import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Table } from '@mantine/core'
import { Card } from 'components/Card'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DepositNode } from './types'

const Wrapper = styled.div`
  min-height: 200px;
  max-height: 600px;
`

const DepositCell = styled.td`
  user-select: none;
`
interface MyDepositsProps {
  deposits: DepositNode[]
}

export const MyDeposits: React.VFC<MyDepositsProps> = ({ deposits }) => {
  const rows = deposits.map(deposit => (
    <tr key={deposit.id}>
      <DepositCell>
        {format(new Date(deposit.createdAt), 'yy.MM.dd')}
      </DepositCell>
      <DepositCell>{deposit.amount}</DepositCell>
      <DepositCell>{deposit.approved ? '✅' : '❌'}</DepositCell>
    </tr>
  ))
  return (
    <Card>
      <Wrapper>
        <Table>
          <thead>
            <tr>
              <th>Dato</th>
              <th>Mengde</th>
              <th>Godkjent</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Link to="/economy/me/deposit-history">
          Fullstendig historikk {<FontAwesomeIcon icon="arrow-right" />}
        </Link>
      </Wrapper>
    </Card>
  )
}
