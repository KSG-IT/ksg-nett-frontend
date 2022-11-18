import { useMutation, useQuery } from '@apollo/client'
import { Button, Card, Group, Stack, Table, Text, Title } from '@mantine/core'
import { CardTable } from 'components/CardTable'
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
      EXTERNALLY_AVAILABLE_INTERNAL_GROUP_POSITIONS_QUERY,
      {
        fetchPolicy: 'network-only',
      }
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
    <Stack>
      <Title>Tilgjengelige verv</Title>
      <MessageBox type="info">
        Her kan du velge verv som skal være mulig å søke på og hvor mange vi tar
        opp i hver av stillingene.
      </MessageBox>
      <CardTable>
        <thead>
          <tr>
            <th>Stilling</th>
            <th>Type</th>
            <th>Antall</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentAdmissionInternalGroupPositionData.map(position => (
            <PositionAvailabilityInput
              availablePosition={position}
              key={position.id}
            />
          ))}
        </tbody>
      </CardTable>
      <Title order={3}>Legg til verv</Title>
      <CardTable>
        <thead>
          <tr>
            <th>Verv</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {availablePositionsToAdd.map(position => (
            <tr key={position.id}>
              <td>
                <Text>{position.name}</Text>
              </td>
              <td>
                <Button
                  color="samfundet-red"
                  onClick={() => handleAddPosition(position.id)}
                >
                  Gjør tilgjengelig
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </CardTable>
      <Group>
        <Button
          color="samfundet-red"
          onClick={() => setStageCallback('INTERVIEW_TEMPLATE')}
        >
          Forrige steg
        </Button>
        <Button
          color="samfundet-red"
          onClick={() => setStageCallback('SUMMARY')}
        >
          Neste steg
        </Button>
      </Group>
    </Stack>
  )
}
