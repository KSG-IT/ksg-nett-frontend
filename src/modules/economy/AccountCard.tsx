import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card } from 'components/Card'
import { useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { numberWithSpaces } from 'util/parsing'
import { PATCH_SOCI_BANK_ACCOUNT } from './mutations'
import {
  PatchSociBankAccountReturns,
  PatchSociBankAccountVariables,
  SociBankAccountNode,
} from './types'

const EditIcon = styled(FontAwesomeIcon)`
  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 5px;
  gap: 10px;
`

const Label = styled.label`
  margin-right: 10px;
`

const Balance = styled.span`
  font-size: 18px;
  font-weight: 600;
`

const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`

const CardInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  input {
    margin-right: 5px;
  }
`

interface AccountCardProps {
  account: Pick<SociBankAccountNode, 'balance' | 'cardUuid' | 'id'>
}

export const AccountCard: React.VFC<AccountCardProps> = ({ account }) => {
  const [cardUuid, setCardUuid] = useState(account.cardUuid)
  const [editable, setEditable] = useState(false)

  const [changeCardUuid] = useMutation<
    PatchSociBankAccountReturns,
    PatchSociBankAccountVariables
  >(PATCH_SOCI_BANK_ACCOUNT, {
    variables: { id: account.id, input: { cardUuid: cardUuid } },
    refetchQueries: ['Me', 'MyBankAccount'],
    onCompleted() {
      toast.success('Kortnummer oppdatert!')
    },
  })

  const toggleEditable = () => {
    if (editable) {
      // We are going from editable to non-editable meaning we want to save the change
      handleChangeCardUuid()
    }
    setEditable(!editable)
  }

  const handleChangeCardUuid = () => {
    console.log(cardUuid)
    console.log(account.cardUuid)
    if (cardUuid === account.cardUuid) return

    changeCardUuid()
  }

  return (
    <Card>
      <Layout>
        <CardRow>
          <Label>Saldo:</Label>
          <Balance>{numberWithSpaces(account.balance)},- NOK</Balance>
        </CardRow>
        <CardRow>
          <Label>Kortnummer:</Label>
          <CardInputContainer>
            <input
              value={cardUuid}
              disabled={!editable}
              onChange={evt => setCardUuid(evt.target.value)}
              onBlur={toggleEditable}
            />
            <EditIcon icon="edit" onClick={toggleEditable} />
          </CardInputContainer>
        </CardRow>
      </Layout>
    </Card>
  )
}
