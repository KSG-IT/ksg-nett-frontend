import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { CardTable } from 'components/CardTable'
import {
  useGiveApplicantToInternalGroupMutation,
  useResetApplicantInternalGroupPositionOffer,
} from 'modules/admissions/mutations.hooks'
import { ApplicantInterestNode } from 'modules/admissions/types.graphql'
import { Link } from 'react-router-dom'
import { usePermissions } from 'util/hooks/usePermissions'
import { PERMISSIONS } from 'util/permissions'

const parsePositionOffer = (
  interest: ApplicantInterestNode['positionToBeOffered']
) => {
  if (interest === null) return 'Nej'

  return interest.name
}

export const FreeForAllWithOffersTable: React.VFC<{
  applicantInterests: ApplicantInterestNode[]
}> = ({ applicantInterests }) => {
  const { hasPermissions } = usePermissions()

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
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message: message,
        })
      },
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
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message: message,
        })
      },
    })
  }

  const interestRows = applicantInterests.map(interest => (
    <tr key={interest.id}>
      <td key={1}>
        <Link to={`/admissions/applicants/${interest.applicant.id}`}>
          {interest.applicant.fullName}
        </Link>
      </td>
      <td key={2}>{interest.internalGroup.name}</td>
      <td key={3}>
        <Button
          disabled={!hasPermissions(PERMISSIONS.admissions.change.admission)}
          onClick={() => handleGiveApplicant(interest.id)}
        >
          Gi til {interest.internalGroup.name}
        </Button>
      </td>
      <td key={4}>{parsePositionOffer(interest.positionToBeOffered)}</td>
      <td key={5}>
        <Button
          disabled={!hasPermissions(PERMISSIONS.admissions.change.admission)}
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
