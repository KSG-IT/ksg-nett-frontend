import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Group,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { CREATE_INTERVIEW_LOCATION } from 'modules/admissions/mutations'
import {
  AllInterviewLocationsReturns,
  CreateInterviewLocationReturns,
  CreateInterviewLocationVariables,
} from 'modules/admissions/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMediaQuery } from 'util/hooks'
import { ALL_INTERVIEW_LOCATIONS_QUERY } from '../../queries'
import { InterviewLocationAvailabilityCard } from './InterviewLocationAvailabilityCard'
type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'

interface ConfigureInterviewLocationAvailabilityProps {
  setStageCallback: (stage: WizardStage) => void
}

export const ConfigureInterviewLocationAvailability: React.VFC<
  ConfigureInterviewLocationAvailabilityProps
> = ({ setStageCallback }) => {
  const [interviewLocationName, setInterviewLocationName] = useState('')
  const isMobile = useMediaQuery('(max-width: 600px)')

  const { data, loading, error } = useQuery<AllInterviewLocationsReturns>(
    ALL_INTERVIEW_LOCATIONS_QUERY,
    {
      fetchPolicy: 'network-only',
    }
  )
  const interviewLocations = data?.allInterviewLocations || []

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
    <Stack>
      <Title>Lokaler booket for intervjuperiode</Title>
      <SimpleGrid cols={isMobile ? 1 : 3}>
        {interviewLocations.map(location => (
          <InterviewLocationAvailabilityCard
            interviewLocation={location}
            key={location.name}
          />
        ))}
      </SimpleGrid>

      <Stack>
        <TextInput
          value={interviewLocationName}
          label="Legg til nytt lokale"
          placeholder="Navn på lokale"
          onChange={evt => setInterviewLocationName(evt.target.value)}
        />
        <Group>
          <Button color="samfundet-red" onClick={handleCreateInterviewLocation}>
            Opprett nytt lokale
          </Button>
        </Group>
      </Stack>
      <Group my="lg">
        <Button
          color="samfundet-red"
          onClick={() => setStageCallback('SCHEDULE')}
        >
          Forrige steg
        </Button>
        <Button
          color="samfundet-red"
          onClick={() => setStageCallback('INTERVIEW_TEMPLATE')}
        >
          Neste steg
        </Button>
      </Group>
    </Stack>
  )
}
