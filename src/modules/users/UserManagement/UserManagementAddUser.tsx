import { useMutation } from '@apollo/client'
import { Button, Group } from '@mantine/core'
import { InternalGroupPositionSelect, UserSelect } from 'components/Select'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { InternalGroupPositionTypeSelect } from './InternalGroupPositionTypeSelect'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from './mutations'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionTypeOption,
} from './types'

const Wrapper = styled.div``

const Title = styled.h1`
  margin: 0;
`

interface UserManagementAddUserProps {
  setModalOpen: (open: boolean) => void
}
export const UserManagementAddUser: React.VFC<UserManagementAddUserProps> = ({
  setModalOpen,
}) => {
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
  const history = useNavigate()

  const [assignNewPosition, { loading }] = useMutation<
    AssignNewInternalGroupPositionMembershipReturns,
    AssignNewInternalGroupPositionMembershipVariables
  >(ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP, {
    onCompleted() {
      setModalOpen(false)
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
      <Group mt="md" position="right">
        <Button color="gray" onClick={() => setModalOpen(false)}>
          Avbryt
        </Button>
        <Button onClick={handleAssignNewPosition} disabled={loading}>
          Lagre
        </Button>
      </Group>
    </Wrapper>
  )
}
