import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Menu, Table, Text } from '@mantine/core'
import { InternalGroupNode } from 'modules/organization/types'
import { UserThumbnail } from 'modules/users'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import {
  InternalGroupPositionPriorityNode,
  InternalGroupPriority,
} from '../types'
import { PATCH_INTERNAL_GROUP_POSITION_PRIORITY } from './mutations'
import { PatchInternalGroupPositionPriorityReturns } from './types'

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
`

const TableHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
`

const TableHeaderCell = styled.div``

const TableRow = styled.div`
  display: flex;
  flex-direction: row;
`

const TableCell = styled.div``

interface DiscussApplicantsTableProps {
  internalGroupPositionPriorites: InternalGroupPositionPriorityNode[]
  internalGroup: InternalGroupNode
}

export const DiscussApplicantsTable: React.VFC<DiscussApplicantsTableProps> = ({
  internalGroupPositionPriorites,
  internalGroup,
}) => {
  const history = useHistory()
  const handleRenderInterviewers = (
    internalGroupPositionPriority: InternalGroupPositionPriorityNode
  ) => {
    if (internalGroupPositionPriority.applicant.interview === null) return

    if (internalGroupPositionPriority.applicant.interview === undefined) return

    return internalGroupPositionPriority.applicant.interview.interviewers.map(
      interviewer => <UserThumbnail user={interviewer} size="small" />
    )
  }

  const [patchInternalGroupPositionPriority] = useMutation<
    PatchInternalGroupPositionPriorityReturns,
    PatchMutationVariables<InternalGroupPositionPriorityNode>
  >(PATCH_INTERNAL_GROUP_POSITION_PRIORITY, {
    refetchQueries: ['InternalGroupDiscussionDataQuery'],
  })

  const handleMoreInfo = (
    internalGroupPositionPriority: InternalGroupPositionPriorityNode
  ) => {
    const { applicant } = internalGroupPositionPriority
    history.push(`/admissions/applicants/${applicant.id}`)
  }

  const handleSetApplicantStatus = (
    internalGroupPositionPriority: InternalGroupPositionPriorityNode,
    status: InternalGroupPriority
  ) => {
    patchInternalGroupPositionPriority({
      variables: {
        id: internalGroupPositionPriority.id,
        input: { internalGroupPriority: status },
      },
    })
  }

  const rows = internalGroupPositionPriorites.map(priority => (
    <tr key={priority.id}>
      <td>{priority.applicant.fullName}</td>
      <td>
        <Badge>{priority.applicantPriority}</Badge>
      </td>
      <td>
        <Badge>{priority.internalGroupPriority}</Badge>
      </td>
      <td>{handleRenderInterviewers(priority)}</td>
      <td>
        <Menu>
          <Menu.Label>Handlinger</Menu.Label>
          <Menu.Item icon={<FontAwesomeIcon icon="check" color="green" />}>
            <Text onClick={() => handleSetApplicantStatus(priority, 'WANT')}>
              Vil ha
            </Text>
          </Menu.Item>
          <Menu.Item icon={<FontAwesomeIcon icon="times" color="red" />}>
            <Text
              onClick={() => handleSetApplicantStatus(priority, 'DO_NOT_WANT')}
            >
              Vil ikke ha
            </Text>
          </Menu.Item>
          <Menu.Item icon={<FontAwesomeIcon icon="wheelchair" color="blue" />}>
            <Text onClick={() => handleSetApplicantStatus(priority, 'RESERVE')}>
              Reserve
            </Text>
          </Menu.Item>
          <Menu.Item icon={<FontAwesomeIcon icon="clock" color="yellow" />}>
            <Text
              onClick={() => handleSetApplicantStatus(priority, 'PASS_AROUND')}
            >
              Send på runde
            </Text>
          </Menu.Item>
        </Menu>
      </td>
    </tr>
  ))

  return (
    <Table highlightOnHover>
      <thead>
        <td>Navn</td>
        <td>Prioritet søker</td>
        <td>Status</td>
        <td>Intervjuere</td>
        <td>Handlinger</td>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}
