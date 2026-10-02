import { Button, Table } from '@mantine/core'
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

export const FreeForAllWithOffersTable: React.FC<{
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
    <Table.Tr key={interest.id}>
      <Table.Td key={1}>
        <Link to={`/admissions/applicants/${interest.applicant.id}`}>
          {interest.applicant.fullName}
        </Link>
      </Table.Td>
      <Table.Td key={2}>{interest.internalGroup.name}</Table.Td>
      <Table.Td key={3}>
        <Button
          disabled={!hasPermissions(PERMISSIONS.admissions.change.admission)}
          onClick={() => handleGiveApplicant(interest.id)}
        >
          Gi til {interest.internalGroup.name}
        </Button>
      </Table.Td>
      <Table.Td key={4}>
        {parsePositionOffer(interest.positionToBeOffered)}
      </Table.Td>
      <Table.Td key={5}>
        <Button
          disabled={!hasPermissions(PERMISSIONS.admissions.change.admission)}
          onClick={() => handleResetApplicantInterest(interest.id)}
          color="red"
        >
          Nullstill
        </Button>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th key={1}>Navn</Table.Th>
          <Table.Th key={2}>Gjeng</Table.Th>
          <Table.Th key={3}>Gi kandidat til gjeng</Table.Th>
          <Table.Th key={4}>Status</Table.Th>
          <Table.Th key={5}>Nullstill</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{interestRows}</Table.Tbody>
    </CardTable>
  )
}
