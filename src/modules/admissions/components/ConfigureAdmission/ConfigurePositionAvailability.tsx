import { useMutation, useQuery } from '@apollo/client'
import { Button, Card, Table, Text, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { CREATE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA } from 'modules/admissions/mutations'
import { EXTERNALLY_AVAILABLE_INTERNAL_GROUP_POSITIONS_QUERY } from 'modules/admissions/queries'
import { AdmissionAvailableInternalGroupPositionData } from 'modules/admissions/types.graphql'
import { InternalGroupPositionNode } from 'modules/organization/types'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { PositionAvailabilityInput } from './PositionAvailabilityInput'
type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: flex;
  flex-direction: column;
`

const AvailablePositionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const AvailablePositionsRow = styled.div`
  display: flex;
  flex-direction: row;
`

const NavigationContainer = styled.div``

interface ExternallyAvailableInternalGroupPositionsReturns {
  currentAdmissionInternalGroupPositionData: AdmissionAvailableInternalGroupPositionData[]
  externallyAvailableInternalGroupPositions: InternalGroupPositionNode[]
}

interface ConfigurePosistionAvailabilityProps {
  setStageCallback: (stage: WizardStage) => void
}

export const ConfigurePosistionAvailability: React.VFC<
  ConfigurePosistionAvailabilityProps
> = ({ setStageCallback }) => {
  const [availablePositionsToAdd, setAvailablePositionsToAdd] = useState<
    InternalGroupPositionNode[]
  >([])

  const { loading, error, data } =
    useQuery<ExternallyAvailableInternalGroupPositionsReturns>(
      EXTERNALLY_AVAILABLE_INTERNAL_GROUP_POSITIONS_QUERY
    )

  const [addInternalGroupPosition] = useMutation(
    CREATE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA,
    { refetchQueries: ['ExternallyAvailableInternalGroupPositionsQuery'] }
  )

  useEffect(() => {
    if (!data) return
    const {
      externallyAvailableInternalGroupPositions,
      currentAdmissionInternalGroupPositionData,
    } = data

    const availablePositionsIds = currentAdmissionInternalGroupPositionData.map(
      position => position.internalGroupPosition.id
    )

    const filteredPositions = externallyAvailableInternalGroupPositions.filter(
      position => {
        return !availablePositionsIds.includes(position.id)
      }
    )

    setAvailablePositionsToAdd(filteredPositions)
  }, [data])

  const handleAddPosition = (id: string) => {
    addInternalGroupPosition({
      variables: {
        input: { internalGroupPosition: id, availablePositions: 1 },
      },
    })
  }

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { currentAdmissionInternalGroupPositionData } = data

  return (
    <Wrapper>
      <Title my="md">Tilgjengelige verv</Title>
      <MessageBox type="info">
        Her kan du velge verv som skal være mulig å søke på og hvor mange vi tar
        opp i hver av stillingene.
      </MessageBox>
      <Card my="md">
        {currentAdmissionInternalGroupPositionData.map(position => (
          <PositionAvailabilityInput
            availablePosition={position}
            key={position.id}
          />
        ))}
      </Card>

      <Title order={3}>Legg til verv</Title>
      <Card>
        <Table>
          <thead>
            <td>Verv</td>
          </thead>
          <tbody>
            {availablePositionsToAdd.map(position => (
              <tr>
                <td>
                  <Text>{position.name}</Text>
                </td>
                <td>
                  <Button onClick={() => handleAddPosition(position.id)}>
                    Gjør tilgjengelig
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <NavigationContainer>
        <button onClick={() => setStageCallback('INTERVIEW_TEMPLATE')}>
          Forrige steg
        </button>
        <button onClick={() => setStageCallback('SUMMARY')}>Neste steg</button>
      </NavigationContainer>
    </Wrapper>
  )
}
