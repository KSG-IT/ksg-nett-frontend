import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, Text } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import { PatchMutationVariables } from 'types/graphql'
import {
  ApplicantNode,
  InternalGroupPositionPriority,
  InternalGroupPositionPriorityNode,
  InternalGroupPriority,
} from '../types'
import { InternalGroupPositionPriorityBadge } from './InternalGroupPositionPriorityBadge'
import { PATCH_INTERNAL_GROUP_POSITION_PRIORITY } from './mutations'
import { PatchInternalGroupPositionPriorityReturns } from './types'

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

interface DiscussApplicantTableRowsProps {
  applicant: ApplicantNode
  internalGroupId: string
}

export const DiscussApplicantTableRows: React.VFC<
  DiscussApplicantTableRowsProps
> = ({ applicant, internalGroupId }) => {
  /**
   * Accepts and applicant and an internal group id. Returns a table row object
   * which is intended to place within a tbody element.
   */
  const history = useHistory()
  const { priorities } = applicant

  const [patchInternalGroupPositionPriority] = useMutation<
    PatchInternalGroupPositionPriorityReturns,
    PatchMutationVariables<InternalGroupPositionPriorityNode>
  >(PATCH_INTERNAL_GROUP_POSITION_PRIORITY, {
    refetchQueries: ['InternalGroupDiscussionDataQuery'],
  })

  const handleMoreInfo = (applicant: ApplicantNode) => {
    history.push(`/admissions/applicants/${applicant.id}`)
  }

  const handleSetApplicantStatus = (status: InternalGroupPriority) => {
    // An applicant has several priorities, we need to get the
    // one that matches the current internalGroup
    const cleanedPriorities = applicant.priorities.filter(
      priority => priority !== null
    ) as InternalGroupPositionPriorityNode[] // This is non-null version of the priorities

    const thisInternalGroupPriority = cleanedPriorities.find(
      priority =>
        priority.internalGroupPosition.internalGroup.id === internalGroupId
    )

    // find() returns undefined if no match is found
    if (thisInternalGroupPriority === undefined)
      throw Error('Internal group is undefined')

    patchInternalGroupPositionPriority({
      variables: {
        id: thisInternalGroupPriority.id,
        input: { internalGroupPriority: status },
      },
    })
  }

  const priorityCells = priorities.map(priority => renderPrioritycell(priority))

  return (
    <tr>
      <td>{applicant.fullName}</td>
      {priorityCells}
      <td>
        <Menu>
          <Menu.Item icon={<FontAwesomeIcon icon="eye" />}>
            <Text onClick={() => handleMoreInfo(applicant)}>Mer info</Text>
          </Menu.Item>
          <Menu.Label>Handlinger</Menu.Label>
          <Menu.Item icon={<FontAwesomeIcon icon="check" color="green" />}>
            <Text onClick={() => handleSetApplicantStatus('WANT')}>Vil ha</Text>
          </Menu.Item>
          <Menu.Item icon={<FontAwesomeIcon icon="question" color="orange" />}>
            <Text onClick={() => handleSetApplicantStatus('PROBABLY_WANT')}>
              Vil sannsynligvis ha
            </Text>
          </Menu.Item>
          <Menu.Item icon={<FontAwesomeIcon icon="box" color="turqois" />}>
            <Text onClick={() => handleSetApplicantStatus('INTERESTED')}>
              Interessert
            </Text>
          </Menu.Item>

          <Menu.Item icon={<FontAwesomeIcon icon="wheelchair" color="blue" />}>
            <Text onClick={() => handleSetApplicantStatus('RESERVE')}>
              Reserve
            </Text>
          </Menu.Item>
          <Menu.Item icon={<FontAwesomeIcon icon="hourglass" color="pink" />}>
            <Text onClick={() => handleSetApplicantStatus('PASS_AROUND')}>
              Send på runde
            </Text>
          </Menu.Item>
          <Menu.Item icon={<FontAwesomeIcon icon="trash-alt" color="red" />}>
            <Text onClick={() => handleSetApplicantStatus('DO_NOT_WANT')}>
              Vil ikke ha
            </Text>
          </Menu.Item>
        </Menu>
      </td>
    </tr>
  )
}
