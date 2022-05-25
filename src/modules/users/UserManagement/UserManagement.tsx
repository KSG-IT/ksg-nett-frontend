import { Button, Checkbox, Group, Modal, Paper } from '@mantine/core'
import { InternalGroupSelect } from 'components/Select/InternalGroupSelect'
import { useState } from 'react'
import styled from 'styled-components'
import { UserManagementAddUser } from './UserManagementAddUser'
import { UserManagementTable } from './UserManagementTable'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Title = styled.h1`
  margin: 0;
`

const ControllerPanelContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`

const ControllerGroup = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: row;
  align-items: flex-end;
`

export const UserManagement: React.VFC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeUsersOnly, setActiveUsersOnly] = useState(true)
  const [internalGroupId, setInternalGroupId] = useState('')

  return (
    <Wrapper>
      <Title>Administrer brukere </Title>
      <Paper p="md">
        <Group position="apart">
          <Group>
            <InternalGroupSelect
              internalGroupId={internalGroupId}
              setInternalGroupCallback={setInternalGroupId}
            />
            <Checkbox
              checked={activeUsersOnly}
              label="Kun aktive"
              onChange={() => {
                setActiveUsersOnly(!activeUsersOnly)
              }}
            />
          </Group>
          <Button onClick={() => setModalOpen(true)}>Tilegn nytt verv</Button>
        </Group>
      </Paper>
      <Paper p="md">
        <UserManagementTable
          activeOnly={activeUsersOnly}
          internalGroupId={internalGroupId}
        />
      </Paper>
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        <UserManagementAddUser setModalOpen={setModalOpen} />
      </Modal>
    </Wrapper>
  )
}
