import { Button, Table } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { CardTable } from 'components/CardTable'
import { MessageBox } from 'components/MessageBox'
import {
  useCreateApplicantInterest,
  useDeleteApplicantInterest,
} from 'modules/admissions/mutations.hooks'
import {
  ApplicantNode,
  InternalGroupPositionPriority,
} from 'modules/admissions/types.graphql'
import { useNavigate } from 'react-router-dom'
import { InternalGroupPositionPriorityBadge } from '../InternalGroupPositionPriorityBadge'

const renderPrioritycell = (priority: InternalGroupPositionPriority) => {
  // We need table cell content regardless of the priority being null or not
  if (priority === null)
    return (
      <>
        <Table.Td></Table.Td>
        <Table.Td></Table.Td>
      </>
    )

  return (
    <>
      <Table.Td>{priority.internalGroupPosition.internalGroup.name}</Table.Td>
      <Table.Td>
        <InternalGroupPositionPriorityBadge priority={priority} />
      </Table.Td>
    </>
  )
}

const renderActionButton = (
  applicant: ApplicantNode,
  internalGroupId: string
) => {
  const { internalGroupInterests } = applicant
  const interest = internalGroupInterests.find(
    interest => interest.internalGroup.id === internalGroupId
  )

  const { createApplicantInterest } = useCreateApplicantInterest()
  const { deleteApplicantInterest } = useDeleteApplicantInterest()

  const handleCreateApplicantInterest = () => {
    createApplicantInterest({
      variables: {
        input: {
          applicant: applicant.id,
          internalGroup: internalGroupId,
        },
      },
      refetchQueries: ['InternalGroupDiscussionDataQuery'],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Nei men så hyggelig',
        })
      },
    })
  }

  if (interest === undefined) {
    return (
      <Button onClick={handleCreateApplicantInterest} color="green">
        Vi vil ha!
      </Button>
    )
  }
  const handleDeleteApplicantInterest = () => {
    deleteApplicantInterest({
      variables: { id: interest.id },
      refetchQueries: ['InternalGroupDiscussionDataQuery'],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'rip',
        })
      },
    })
  }

  return (
    <Button onClick={handleDeleteApplicantInterest} color="red">
      Sike!
    </Button>
  )
}

interface FreeForAllApplicantsTableProps {
  applicants: ApplicantNode[]
  internalGroupId: string
}

export const FreeForAllApplicantsTable: React.FC<
  FreeForAllApplicantsTableProps
> = ({ applicants, internalGroupId }) => {
  const navigate = useNavigate()

  if (applicants.length === 0) {
    return (
      <MessageBox type="warning">
        Det finnes ingen andre søkere som er åpne for andre verv
      </MessageBox>
    )
  }

  // Handlers
  function handleMoreInfo(applicant: ApplicantNode) {
    navigate(`/admissions/applicants/${applicant.id}`)
  }

  // Render rows
  const rows = applicants.map(applicant => (
    <Table.Tr key={applicant.id}>
      <Table.Td>{applicant.fullName}</Table.Td>
      {applicant.priorities.map(priority => renderPrioritycell(priority))}
      <Table.Td>
        <Button onClick={() => handleMoreInfo(applicant)} variant="outline">
          Kandidatdetaljer
        </Button>
      </Table.Td>
      <Table.Td>{renderActionButton(applicant, internalGroupId)}</Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Førstevalg</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th>Andrevalg</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th>Tredjevalg</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th></Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}
