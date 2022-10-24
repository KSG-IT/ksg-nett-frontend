import { Button, Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import {
  useGiveApplicantToInternalGroupMutation,
  useResetApplicantInternalGroupPositionOffer,
} from 'modules/admissions/mutations.hooks'
import { ApplicantInterestNode } from 'modules/admissions/types.graphql'

const parsePositionOffer = (
  interest: ApplicantInterestNode['positionToBeOffered']
) => {
  if (interest === null) return 'Nej'

  return interest.name
}

export const FreeForAllWithOffersTable: React.VFC<{
  applicantInterests: ApplicantInterestNode[]
}> = ({ applicantInterests }) => {
  const { giveApplicantToInternalGroupMutation } =
    useGiveApplicantToInternalGroupMutation()
  const { resetApplicantInternalGroupPositionOfferMutation } =
    useResetApplicantInternalGroupPositionOffer()

  const handleGiveApplicant = (interestId: string) => {
    giveApplicantToInternalGroupMutation({
      variables: {
        applicantInterestId: interestId,
      },
      refetchQueries: [
        'CloseAdmissionQueryData',
        'AdmissionApplicantPreviewQuery',
      ],
    })
  }

  const handleResetApplicantInterest = (applicantInterestId: string) => {
    resetApplicantInternalGroupPositionOfferMutation({
      variables: {
        applicantInterestId: applicantInterestId,
      },
      refetchQueries: [
        'CloseAdmissionQueryData',
        'AdmissionApplicantPreviewQuery',
      ],
    })
  }

  const interestRows = applicantInterests.map(interest => (
    <tr key={interest.id}>
      <td key={1}>{interest.applicant.fullName}</td>
      <td key={2}>{interest.internalGroup.name}</td>
      <td key={3}>
        <Button onClick={() => handleGiveApplicant(interest.id)}>
          Gi til {interest.internalGroup.name}
        </Button>
      </td>
      <td key={4}>{parsePositionOffer(interest.positionToBeOffered)}</td>
      <td key={5}>
        <Button
          onClick={() => handleResetApplicantInterest(interest.id)}
          color="red"
        >
          Nullstill
        </Button>
      </td>
    </tr>
  ))

  return (
    <CardTable>
      <thead>
        <tr>
          <th key={1}>Navn</th>
          <th key={2}>Gjeng</th>
          <th key={3}>Gi kandidat til gjeng</th>
          <th key={4}>Status</th>
          <th key={5}>Nullstill</th>
        </tr>
      </thead>
      <tbody>{interestRows}</tbody>
    </CardTable>
  )
}
