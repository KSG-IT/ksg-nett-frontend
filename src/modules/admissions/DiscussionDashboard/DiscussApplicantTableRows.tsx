import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Loader, Menu, Text, useMantineTheme } from '@mantine/core'
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

const renderPrioritycell = (
  priority: InternalGroupPositionPriority,
  index: number
) => {
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
  const theme = useMantineTheme()
  const { priorities } = applicant

  const [patchInternalGroupPositionPriority, { loading }] = useMutation<
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
      // Exceptions shall not pass silently
      throw Error('Internal group is undefined')

    patchInternalGroupPositionPriority({
      variables: {
        id: thisInternalGroupPriority.id,
        input: { internalGroupPriority: status },
      },
    })
  }

  const priorityCells = priorities.map((priority, index) =>
    renderPrioritycell(priority, index)
  )
  return (
    <tr>
      <td>{applicant.fullName}</td>
      {priorityCells}
      <td>
        {loading ? (
          <Loader />
        ) : (
          <Menu>
            <Menu.Item icon={<FontAwesomeIcon icon="eye" />}>
              <Text onClick={() => handleMoreInfo(applicant)}>Mer info</Text>
            </Menu.Item>
            <Menu.Label>Handlinger</Menu.Label>
            <Menu.Item
              icon={
                <FontAwesomeIcon icon="square" color={theme.colors.blue[5]} />
              }
            >
              <Text
                onClick={() => handleSetApplicantStatus('CURRENTLY_DISCUSSING')}
              >
                Diskuteres
              </Text>
            </Menu.Item>
            <Menu.Item
              icon={
                <FontAwesomeIcon icon="check" color={theme.colors.green[5]} />
              }
            >
              <Text onClick={() => handleSetApplicantStatus('WANT')}>
                Vil ha
              </Text>
            </Menu.Item>
            <Menu.Item
              icon={
                <FontAwesomeIcon
                  icon="question"
                  color={theme.colors.orange[5]}
                />
              }
            >
              <Text onClick={() => handleSetApplicantStatus('PROBABLY_WANT')}>
                Vil sannsynligvis ha
              </Text>
            </Menu.Item>
            <Menu.Item
              icon={
                <FontAwesomeIcon icon="box" color={theme.colors.grape[5]} />
              }
            >
              <Text onClick={() => handleSetApplicantStatus('INTERESTED')}>
                Interessert
              </Text>
            </Menu.Item>

            <Menu.Item
              icon={
                <FontAwesomeIcon
                  icon="wheelchair"
                  color={theme.colors.yellow[5]}
                />
              }
            >
              <Text onClick={() => handleSetApplicantStatus('RESERVE')}>
                Reserve
              </Text>
            </Menu.Item>
            <Menu.Item
              icon={
                <FontAwesomeIcon
                  icon="hourglass"
                  color={theme.colors.pink[5]}
                />
              }
            >
              <Text onClick={() => handleSetApplicantStatus('PASS_AROUND')}>
                Send på runde
              </Text>
            </Menu.Item>
            <Menu.Item
              icon={
                <FontAwesomeIcon icon="trash-alt" color={theme.colors.red[5]} />
              }
            >
              <Text onClick={() => handleSetApplicantStatus('DO_NOT_WANT')}>
                Vil ikke ha
              </Text>
            </Menu.Item>
          </Menu>
        )}
      </td>
    </tr>
  )
}
