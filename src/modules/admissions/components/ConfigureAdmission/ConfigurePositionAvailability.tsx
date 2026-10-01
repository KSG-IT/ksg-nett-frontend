import { useMutation, useQuery } from '@apollo/client'
import { Button, Group, Stack, Table, Text, Title } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { CREATE_ADMISSION_AVAILABLE_INTERNAL_GROUP_POSITION_DATA } from 'modules/admissions/mutations'
import { EXTERNALLY_AVAILABLE_INTERNAL_GROUP_POSITIONS_QUERY } from 'modules/admissions/queries'
import { AdmissionAvailableInternalGroupPositionData } from 'modules/admissions/types.graphql'
import { InternalGroupPositionNode } from 'modules/organization/types'
import { useEffect, useState } from 'react'
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

export const ConfigurePosistionAvailability: React.FC<
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
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Stilling</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Antall</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {currentAdmissionInternalGroupPositionData.map(position => (
            <PositionAvailabilityInput
              availablePosition={position}
              key={position.id}
            />
          ))}
        </Table.Tbody>
      </CardTable>
      <Title order={3}>Legg til verv</Title>
      <CardTable>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Verv</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {availablePositionsToAdd.map(position => (
            <Table.Tr key={position.id}>
              <Table.Td>
                <Text>{position.name}</Text>
              </Table.Td>
              <Table.Td>
                <Button
                  color="samfundet-red"
                  onClick={() => handleAddPosition(position.id)}
                >
                  Gjør tilgjengelig
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
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
