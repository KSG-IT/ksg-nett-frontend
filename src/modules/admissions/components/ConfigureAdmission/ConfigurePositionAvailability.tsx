import { useMutation, useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
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
  | null

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

const Title = styled.h1`
  margin: 0;
`

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
      <Title>Tilgjengelige verv</Title>
      {currentAdmissionInternalGroupPositionData.map(position => (
        <PositionAvailabilityInput
          availablePosition={position}
          key={position.id}
        />
      ))}

      <h2>Legg til verv</h2>
      <AvailablePositionsContainer>
        {availablePositionsToAdd.map(position => (
          <AvailablePositionsRow key={position.id}>
            <span>{position.name}</span>
            <button onClick={() => handleAddPosition(position.id)}>
              Gjør tilgjengelig
            </button>
          </AvailablePositionsRow>
        ))}
      </AvailablePositionsContainer>
      <NavigationContainer>
        <button onClick={() => setStageCallback('INTERVIEW_TEMPLATE')}>
          Forrige steg
        </button>
        <button onClick={() => setStageCallback('SUMMARY')}>Neste steg</button>
      </NavigationContainer>
    </Wrapper>
  )
}
