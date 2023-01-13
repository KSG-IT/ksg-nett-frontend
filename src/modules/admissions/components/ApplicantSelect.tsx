import { useQuery } from '@apollo/client'
import { Select } from '@mantine/core'
import { ALL_APPLICANTS_AVAILABLE_FOR_REBOOKING_QUERY } from '../queries'
import {
  AllApplicantsAvailableForRebookingReturns,
  ApplicantNode,
} from '../types.graphql'

export interface ApplicantSelectProps {
  onApplicantSelect: (applicantId: string) => void
}

export const ApplicantSelect: React.FC<ApplicantSelectProps> = ({
  onApplicantSelect,
}) => {
  const { data } = useQuery<AllApplicantsAvailableForRebookingReturns>(
    ALL_APPLICANTS_AVAILABLE_FOR_REBOOKING_QUERY
  )

  const applicantData =
    data?.allApplicantsAvailableForRebooking?.map(applicant => ({
      label: applicant.fullName,
      value: applicant.id,
    })) ?? []

  return (
    <Select
      label="Søker"
      searchable
      placeholder="Søk etter søker"
      data={applicantData}
      onChange={onApplicantSelect}
    />
  )
}
