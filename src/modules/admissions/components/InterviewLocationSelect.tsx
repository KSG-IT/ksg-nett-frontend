import { useQuery } from '@apollo/client'
import { Select } from '@mantine/core'
import { ALL_INTERVIEW_LOCATIONS_QUERY } from '../queries'
import { AllInterviewLocationsReturns } from '../types.graphql'

interface InterviewLocationSelectProps {
  onSelectCallback: (val: string) => void
}

export const InterviewLocationSelect: React.FC<
  InterviewLocationSelectProps
> = ({ onSelectCallback }) => {
  const { data } = useQuery<AllInterviewLocationsReturns>(
    ALL_INTERVIEW_LOCATIONS_QUERY
  )

  const options =
    data?.allInterviewLocations.map(location => ({
      value: location.id,
      label: location.name,
    })) ?? []

  return (
    <Select
      data={options}
      label="Inervjulokale"
      placeholder="Velg et intervjulokale"
      onChange={onSelectCallback}
    ></Select>
  )
}
