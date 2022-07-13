import { useMutation, useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { CREATE_INTERVIEW_LOCATION } from 'modules/admissions/mutations'
import {
  AllInterviewLocationsReturns,
  CreateInterviewLocationReturns,
  CreateInterviewLocationVariables,
  InterviewLocationNode,
} from 'modules/admissions/types.graphql'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { ALL_INTERVIEW_LOCATIONS_QUERY } from '../../queries'
import { InterviewLocationAvailabilityCard } from './InterviewLocationAvailabilityCard'
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
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`

const InterviewLocationAvailabilitesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`

const AddInterviewLocationContainer = styled.div`
  margin: 10px 0;
`

const Title = styled.h1`
  margin: 0 0 32px 0;
`

interface ConfigureInterviewLocationAvailabilityProps {
  setStageCallback: (stage: WizardStage) => void
}

export const ConfigureInterviewLocationAvailability: React.VFC<
  ConfigureInterviewLocationAvailabilityProps
> = ({ setStageCallback }) => {
  const [interviewLocationName, setInterviewLocationName] = useState('')
  const [interviewLocations, setInterviewLocations] = useState<
    InterviewLocationNode[]
  >([])

  const { data, loading, error } = useQuery<AllInterviewLocationsReturns>(
    ALL_INTERVIEW_LOCATIONS_QUERY
  )

  useEffect(() => {
    if (!data) return

    const { allInterviewLocations } = data

    setInterviewLocations(allInterviewLocations)
  }, [data, setInterviewLocations])

  const [createInterviewLocation] = useMutation<
    CreateInterviewLocationReturns,
    CreateInterviewLocationVariables
  >(CREATE_INTERVIEW_LOCATION, {
    variables: { input: { name: interviewLocationName } },
    refetchQueries: ['AllInterviewLocations'],
    onCompleted: data => {
      const { createInterviewLocation } = data
      const { interviewLocation } = createInterviewLocation
      toast.success(`${interviewLocation.name} opprettet`)
      setInterviewLocationName('')
    },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleCreateInterviewLocation = () => {
    if (interviewLocationName === '') return
    const nameFilter = interviewLocations.filter(
      location =>
        location.name.toLocaleLowerCase() ===
        interviewLocationName.toLowerCase()
    )

    if (nameFilter.length > 0) {
      toast.error('Lokalet finnes allerede')
      return
    }

    createInterviewLocation()
  }

  return (
    <Wrapper>
      <Title>Lokaler booket for intervjuperiode</Title>
      <InterviewLocationAvailabilitesContainer>
        {interviewLocations.map(location => (
          <InterviewLocationAvailabilityCard
            interviewLocation={location}
            key={location.name}
          />
        ))}
      </InterviewLocationAvailabilitesContainer>

      <AddInterviewLocationContainer>
        <input
          value={interviewLocationName}
          placeholder="Navn på lokale"
          onChange={evt => setInterviewLocationName(evt.target.value)}
        />
        <button onClick={handleCreateInterviewLocation}>
          Opprett nytt lokale
        </button>
      </AddInterviewLocationContainer>
      <button onClick={() => setStageCallback('SCHEDULE')}>Forrige steg</button>
      <button onClick={() => setStageCallback('INTERVIEW_TEMPLATE')}>
        Neste steg
      </button>
    </Wrapper>
  )
}
