import { useMutation } from '@apollo/client'
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

  return (
    <Wrapper>
      <TableHeaderRow>
        <TableHeaderCell>Navn</TableHeaderCell>
        <TableHeaderCell>Prioritet søker</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableHeaderCell>Intervjuere</TableHeaderCell>
        <TableHeaderCell>Handlinger</TableHeaderCell>
      </TableHeaderRow>
      {internalGroupPositionPriorites.map(internalGroupPositionPriority => (
        <TableRow key={internalGroupPositionPriority.id}>
          <TableCell>
            {internalGroupPositionPriority.applicant.fullName}
          </TableCell>
          <TableCell>
            {internalGroupPositionPriority.applicantPriority}
          </TableCell>
          <TableCell>
            {internalGroupPositionPriority.internalGroupPriority ?? (
              <span>---</span>
            )}
          </TableCell>
          <TableCell>
            {handleRenderInterviewers(internalGroupPositionPriority)}
          </TableCell>
          <TableCell>
            <button
              onClick={() => handleMoreInfo(internalGroupPositionPriority)}
            >
              Mer info
            </button>
          </TableCell>
          <TableCell>
            <button
              onClick={() =>
                handleSetApplicantStatus(internalGroupPositionPriority, 'WANT')
              }
            >
              Vil ha
            </button>
          </TableCell>
          <TableCell>
            <button
              onClick={() =>
                handleSetApplicantStatus(
                  internalGroupPositionPriority,
                  'PASS_AROUND'
                )
              }
            >
              Runde
            </button>
          </TableCell>
          <TableCell>
            <button
              onClick={() =>
                handleSetApplicantStatus(
                  internalGroupPositionPriority,
                  'RESERVE'
                )
              }
            >
              Reserve
            </button>
          </TableCell>
          <TableCell>
            <button
              onClick={() =>
                handleSetApplicantStatus(
                  internalGroupPositionPriority,
                  'DO_NOT_WANT'
                )
              }
            >
              Vil ikke ha
            </button>
          </TableCell>
        </TableRow>
      ))}
    </Wrapper>
  )
}
