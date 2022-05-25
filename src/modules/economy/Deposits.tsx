import { useMutation, useQuery } from '@apollo/client'
import { Button, Group, Paper, Table, Title } from '@mantine/core'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { SIDEBAR_QUERY } from 'modules/sidebar/SidebarNav'
import { ME_QUERY } from 'modules/users'
import { useStore } from 'store'
import styled from 'styled-components'
import { MEDIA_URL } from 'util/env'
import { numberWithSpaces } from 'util/parsing'
import { AllDepositsQuery, ALL_DEPOSITS, DepositNode, PATCH_DEPOSIT } from '.'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  overflow-y: scroll;

  ${props => props.theme.media.mobile} {
    display: flex;
    flex-direction: column;
  }
`

const DepositTableArea = styled.div`
  grid-area: table;
`

const DepositTable = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding: 16px;
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadow.default};
`

const DepositTableHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const DepositTableHeaderCell = styled.div<HideOnMobile>`
  font-size: 18px;
  font-weight: 600;
  width: 150px;

  ${props => props.theme.media.mobile} {
    display: ${props => (props.shouldHide ? 'none' : 'flex')};
  }
`

const DepositTableBody = styled.div``

const DepositTableRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 5px;
`

interface HideOnMobile {
  shouldHide?: boolean
}

const DepositTableCell = styled.div<HideOnMobile>`
  width: 150px;

  ${props => props.theme.media.mobile} {
    display: ${props => (props.shouldHide ? 'none' : 'flex')};
  }
`

const ActionButton1 = styled.button`
  grid-area: button1;
  background-color: ${props => props.theme.colors.purpleAction};
  color: white;
  border: none;
  border-radius: 4px;
  height: 35px;
`

const ActionButton2 = styled.button`
  grid-area: button2;
  border: none;
  border-radius: 4px;
  height: 35px;
  background-color: ${props => props.theme.colors.purple};
  color: ${props => props.theme.colors.white};
`

interface DepositActionButtonProps {
  status: boolean
}

const DepositActionButton = styled.button<DepositActionButtonProps>`
  border: none;
  border-radius: 4px;
  height: 35px;
  width: 90px;
  color: white;
  background-color: ${props =>
    props.status
      ? props.theme.colors.warningRed
      : props.theme.colors.purpleAction};
  cursor: pointer;
`

export const Deposits = () => {
  const [patchDeposit] = useMutation(PATCH_DEPOSIT, {
    refetchQueries: [
      { query: ALL_DEPOSITS },
      { query: SIDEBAR_QUERY },
      { query: ME_QUERY },
    ],
  })
  const user = useStore(state => state.user)!

  const handlePatchDeposit = (deposit: DepositNode) => {
    const { id, signedOffBy } = deposit

    if (!signedOffBy) {
      // not approved yet, approving with the logged in user
      patchDeposit({
        variables: {
          id: id,
          input: {
            signedOffBy: user.id,
          },
        },
      })
    } else {
      //approved so we are unapproving it
      patchDeposit({
        variables: {
          id: id,
          input: {
            signedOffBy: null,
            signedOffTime: null,
          },
        },
      })
    }
  }

  const { data, loading, error } = useQuery<AllDepositsQuery>(ALL_DEPOSITS)

  if (error) return <span>Error</span>

  if (loading || !data) return <FullContentLoader />

  const deposits = data?.allDeposits.edges.map(edge => edge.node) ?? []

  const rows = deposits.map(deposit => (
    <tr>
      <td>{format(new Date(deposit.createdAt), 'MM.dd')}</td>
      <td>{deposit.account.user.fullName}</td>
      <td>{numberWithSpaces(deposit.amount)},- NOK</td>
      <td>
        {deposit.receipt ? (
          <a
            href={`${MEDIA_URL}${deposit.receipt}`}
            target="_blank"
            rel="noreferrer"
          >
            Kvittering
          </a>
        ) : (
          'Ingen kvittering'
        )}
      </td>
      <td>
        <Button
          onClick={() => {
            handlePatchDeposit(deposit)
          }}
        >
          Godkjenn
        </Button>
      </td>
    </tr>
  ))

  return (
    <Wrapper>
      <Group position="apart">
        <Title>Innskudd</Title>
        <Button>Godkjente innskudd</Button>
      </Group>
      <Paper p="md">
        <Table>
          <thead>
            <td>Dato</td>
            <td>Navn</td>
            <td>Beløp</td>
            <td>Kvittering</td>
            <td></td>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Wrapper>
  )
}
