import { useMutation } from '@apollo/client'
import { Button } from 'components/Button'
import { InternalGroupPositionSelect, UserSelect } from 'components/Select'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import {
  InternalGroupPositionTypeOption,
  InternalGroupPositionTypeSelect,
} from './InternalGroupPositionTypeSelect'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from './mutations'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
} from './types'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
`

const Title = styled.h1`
  margin: 0;
`

export const UserManagementAddUser: React.VFC = () => {
  /**
   * 1. Select user
   * 2. Select internal group position
   * 3. Select status
   * 4. Submit and redirect to table
   */
  const [selectedUser, setSelectedUser] = useState('')
  const [internalGroupPositionId, setInternalGroupPositionId] = useState('')
  const [
    selectedInternalGroupPositionType,
    setSelectedInternalGroupPositionType,
  ] = useState<InternalGroupPositionTypeOption | null>(null)
  const history = useHistory()

  const [assignNewPosition, { loading }] = useMutation<
    AssignNewInternalGroupPositionMembershipReturns,
    AssignNewInternalGroupPositionMembershipVariables
  >(ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP, {
    onCompleted() {
      history.push('/users/manage')
    },
  })

  const handleAssignNewPosition = () => {
    if (selectedInternalGroupPositionType === null) return

    assignNewPosition({
      variables: {
        userId: selectedUser,
        internalGroupPositionId: internalGroupPositionId,
        internalGroupPositionType: selectedInternalGroupPositionType.value,
      },
    })
  }

  return (
    <Wrapper>
      <Title>Gi bruker nytt verv</Title>
      <label>Bruker</label>
      <UserSelect setUserCallback={setSelectedUser} />
      <label>Verv</label>
      <InternalGroupPositionSelect
        setInternalGroupPositionCallback={setInternalGroupPositionId}
      />
      <label>Type</label>
      <InternalGroupPositionTypeSelect
        selected={selectedInternalGroupPositionType}
        onChange={setSelectedInternalGroupPositionType}
      />
      <Button
        buttonStyle="cancel"
        onClick={() => history.push('/users/manage')}
      >
        Avbryt
      </Button>
      <Button
        onClick={handleAssignNewPosition}
        buttonStyle="primary"
        disabled={loading}
      >
        Lagre
      </Button>
    </Wrapper>
  )
}
