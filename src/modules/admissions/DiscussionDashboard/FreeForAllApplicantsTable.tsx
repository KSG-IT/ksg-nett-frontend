import { Button, Paper } from '@mantine/core'
import toast from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import {
  useCreateApplicantInterest,
  useDeleteApplicantInterest,
} from '../mutations.hooks'
import { ApplicantNode, InternalGroupPositionPriority } from '../types'
import { InternalGroupPositionPriorityBadge } from './InternalGroupPositionPriorityBadge'

const renderPrioritycell = (priority: InternalGroupPositionPriority) => {
  // We need table cell content regardless of the priority being null or not
  if (priority === null)
    return (
      <>
        <td></td>
        <td></td>
      </>
    )

  return (
    <>
      <td>{priority.internalGroupPosition.internalGroup.name}</td>
      <td>
        <InternalGroupPositionPriorityBadge priority={priority} />
      </td>
    </>
  )
}

const renderActionButton = (
  applicant: ApplicantNode,
  internalGroupId: string
) => {
  const history = useHistory()
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
        toast.success('Interesse for søker registrert!')
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
        toast.success('Interesse for søker slettet!')
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

export const FreeForAllApplicantsTable: React.VFC<
  FreeForAllApplicantsTableProps
> = ({ applicants, internalGroupId }) => {
  const history = useHistory()

  // Handlers
  const handleMoreInfo = (applicant: ApplicantNode) => {
    history.push(`/admissions/applicants/${applicant.id}`)
  }

  // Render rows
  const rows = applicants.map(applicant => (
    <tr key={applicant.id}>
      <td>{applicant.fullName}</td>
      {applicant.priorities.map(priority => renderPrioritycell(priority))}
      <td>
        <Button onClick={() => handleMoreInfo(applicant)} variant="outline">
          Kandidatdetaljer
        </Button>
      </td>
      <td>{renderActionButton(applicant, internalGroupId)}</td>
    </tr>
  ))

  return (
    <Paper p="md">
      <table>
        <thead>
          <td>Navn</td>
          <td>Førstevalg</td>
          <td></td>
          <td>Andrevalg</td>
          <td></td>
          <td>Tredjevalg</td>
          <td></td>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </Paper>
  )
}
