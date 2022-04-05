import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { InternalGroupSelect } from 'components/Select/InternalGroupSelect'
import { useState } from 'react'
import styled from 'styled-components'
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
  const [activeUsersOnly, setActiveUsersOnly] = useState(true)
  const [internalGroupId, setInternalGroupId] = useState('')

  return (
    <Wrapper>
      <Title>Administrer brukere </Title>
      <Card>
        <ControllerPanelContainer>
          <ControllerGroup>
            <InternalGroupSelect
              internalGroupId={internalGroupId}
              setInternalGroupCallback={setInternalGroupId}
            />
            <input
              checked={activeUsersOnly}
              onChange={() => {
                setActiveUsersOnly(!activeUsersOnly)
              }}
              type="checkbox"
            />
            <label>Kun aktive</label>
          </ControllerGroup>
          <Button buttonStyle="primary" width="170px">
            Tilegn nytt verv
          </Button>
        </ControllerPanelContainer>
      </Card>
      <Card>
        <UserManagementTable
          activeOnly={activeUsersOnly}
          internalGroupId={internalGroupId}
        />
      </Card>
    </Wrapper>
  )
}
