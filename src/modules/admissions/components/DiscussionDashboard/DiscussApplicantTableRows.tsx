import { useMutation } from '@apollo/client'
import { Button, Menu, Text, useMantineTheme } from '@mantine/core'
import {
  IconBackpack,
  IconCheck,
  IconCreativeCommonsSa,
  IconDots,
  IconEye,
  IconHourglass,
  IconPlayerPlay,
  IconQuestionMark,
  IconWheelchair,
} from '@tabler/icons'
import { InternalGroupPositionPriorityBadge } from 'modules/admissions/components'
import { InternalGroupPositionPriorityInternalGroupPriorityValues } from 'modules/admissions/consts'
import { PATCH_INTERNAL_GROUP_POSITION_PRIORITY } from 'modules/admissions/mutations'
import {
  ApplicantNode,
  InternalGroupPositionPriority,
  InternalGroupPositionPriorityNode,
  PatchInternalGroupPositionPriorityReturns,
} from 'modules/admissions/types.graphql'
import { useNavigate } from 'react-router-dom'
import { PatchMutationVariables } from 'types/graphql'

const renderPrioritycell = (
  priority: InternalGroupPositionPriority,
  internalGroupId: string,
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

  const bold =
    priority.internalGroupPosition.internalGroup.id === internalGroupId

  return (
    <>
      <td
        style={{
          fontWeight: bold ? 'bold' : 'normal',
        }}
      >
        {priority.internalGroupPosition.internalGroup.name}
      </td>
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
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const { priorities } = applicant

  const [patchInternalGroupPositionPriority, { loading }] = useMutation<
    PatchInternalGroupPositionPriorityReturns,
    PatchMutationVariables<InternalGroupPositionPriorityNode>
  >(PATCH_INTERNAL_GROUP_POSITION_PRIORITY, {
    refetchQueries: ['InternalGroupDiscussionDataQuery'],
  })

  const handleMoreInfo = (applicant: ApplicantNode) => {
    navigate(`/admissions/applicants/${applicant.id}`)
  }

  const handleSetApplicantStatus = (
    status: InternalGroupPositionPriorityInternalGroupPriorityValues
  ) => {
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
    renderPrioritycell(priority, internalGroupId, index)
  )
  return (
    <tr>
      <td>{applicant.fullName}</td>
      {priorityCells}
      <td>
        <Menu position="left-start">
          <Menu.Target>
            <Button variant="outline" loading={loading}>
              <IconDots />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconEye />}>
              <Text onClick={() => handleMoreInfo(applicant)}>Mer info</Text>
            </Menu.Item>
            <Menu.Label>Handlinger</Menu.Label>
            <Menu.Item icon={<IconPlayerPlay />} color="blue">
              <Text
                onClick={() =>
                  handleSetApplicantStatus(
                    InternalGroupPositionPriorityInternalGroupPriorityValues.CURRENTLY_DISCUSSING
                  )
                }
              >
                Diskuteres
              </Text>
            </Menu.Item>
            <Menu.Item color="green" icon={<IconCheck />}>
              <Text
                onClick={() =>
                  handleSetApplicantStatus(
                    InternalGroupPositionPriorityInternalGroupPriorityValues.WANT
                  )
                }
              >
                Vil ha
              </Text>
            </Menu.Item>
            <Menu.Item color="orange" icon={<IconQuestionMark />}>
              <Text
                onClick={() =>
                  handleSetApplicantStatus(
                    InternalGroupPositionPriorityInternalGroupPriorityValues.PROBABLY_WANT
                  )
                }
              >
                Vil sannsynligvis ha
              </Text>
            </Menu.Item>
            <Menu.Item color="grape" icon={<IconBackpack />}>
              <Text
                onClick={() =>
                  handleSetApplicantStatus(
                    InternalGroupPositionPriorityInternalGroupPriorityValues.INTERESTED
                  )
                }
              >
                Interessert
              </Text>
            </Menu.Item>

            <Menu.Item color="yellow" icon={<IconWheelchair />}>
              <Text
                onClick={() =>
                  handleSetApplicantStatus(
                    InternalGroupPositionPriorityInternalGroupPriorityValues.RESERVE
                  )
                }
              >
                Reserve
              </Text>
            </Menu.Item>
            <Menu.Item color="pink" icon={<IconHourglass />}>
              <Text
                onClick={() =>
                  handleSetApplicantStatus(
                    InternalGroupPositionPriorityInternalGroupPriorityValues.PASS_AROUND
                  )
                }
              >
                Send på runde
              </Text>
            </Menu.Item>
            <Menu.Item color="red" icon={<IconCreativeCommonsSa />}>
              <Text
                onClick={() =>
                  handleSetApplicantStatus(
                    InternalGroupPositionPriorityInternalGroupPriorityValues.DO_NOT_WANT
                  )
                }
              >
                Vil ikke ha
              </Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  )
}
