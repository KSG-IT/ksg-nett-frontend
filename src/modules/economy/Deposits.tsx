import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client'
import { SIDEBAR_QUERY } from 'modules/sidebar/SidebarNav'
import { AllDepositsQuery, ALL_DEPOSITS, DepositNode, PATCH_DEPOSIT } from '.'
import { useAuth } from 'context/Authentication'
import { ME_QUERY } from 'modules/users'
import { MEDIA_URL } from 'util/env'

const Wrapper = styled.div`
  display: grid;
  width: 100%;
  overflow-y: scroll;
  height: 100%;
  padding: 32px 32px 32px 32px;

  grid-template-areas:
    'title . . .'
    'toolbar toolbar button1 button2'
    'table table table table';
  grid-template-rows: 75px 75px auto;
  grid-template-columns:
    repeat(4, 1fr)
    ${props => props.theme.media.mobile} {
    display: flex;
    flex-direction: column;
    padding: 16px 32px 0 16px;
  }

  ${props => props.theme.media.mobile} {
    display: flex;
    flex-direction: column;
  }
`

const Title = styled.h1`
  margin: 0;
  grid-area: title;
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

interface StatusPillProps {
  approved: boolean
}

const StatusPill = styled.div<StatusPillProps>`
  display: inline-flex;
  width: 80px;
  height: 100%;
  border-radius: 10px;
  color: white;
  font-size: 11px;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.approved
      ? props.theme.colors.success
      : props.theme.colors.warningRed};
`

export const Deposits = () => {
  const [patchDeposit] = useMutation(PATCH_DEPOSIT, {
    refetchQueries: [
      { query: ALL_DEPOSITS },
      { query: SIDEBAR_QUERY },
      { query: ME_QUERY },
    ],
  })
  const user = useAuth()

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

  if (loading || !data) return <span>Loading...</span>

  const deposits = data?.allDeposits.edges.map(edge => edge.node) ?? []

  return (
    <Wrapper>
      <Title>Deposits</Title>
      <ActionButton1>Some acton</ActionButton1>
      <ActionButton2>Another action</ActionButton2>

      <DepositTableArea>
        <DepositTable>
          <DepositTableHeader>
            <DepositTableHeaderCell>Navn</DepositTableHeaderCell>
            <DepositTableHeaderCell>Mengde</DepositTableHeaderCell>
            <DepositTableHeaderCell shouldHide>
              Kvittering
            </DepositTableHeaderCell>
            <DepositTableHeaderCell>Status</DepositTableHeaderCell>
            <DepositTableHeaderCell>Handling</DepositTableHeaderCell>
          </DepositTableHeader>

          <DepositTableBody>
            {deposits.map((deposit, i) => (
              <DepositTableRow key={i}>
                <DepositTableCell shouldHide={false}>
                  {deposit.account.user.fullName}
                </DepositTableCell>
                <DepositTableCell shouldHide={false}>
                  {deposit.amount},- NOK
                </DepositTableCell>
                <DepositTableCell shouldHide={false}>
                  <a
                    href={`${MEDIA_URL}${deposit.receipt}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Kvittering
                  </a>
                </DepositTableCell>
                <DepositTableCell shouldHide={true}>
                  <StatusPill approved={deposit.approved}>
                    {deposit.approved ? 'Godkjent' : 'Ikke godkjent'}
                  </StatusPill>
                </DepositTableCell>
                <DepositTableCell shouldHide={false}>
                  <DepositActionButton
                    status={deposit.approved}
                    onClick={() => {
                      handlePatchDeposit(deposit)
                    }}
                  >
                    {deposit.approved ? 'Underkjenn' : 'Godkjenn'}
                  </DepositActionButton>
                </DepositTableCell>
              </DepositTableRow>
            ))}
          </DepositTableBody>
        </DepositTable>
      </DepositTableArea>
    </Wrapper>
  )
}
