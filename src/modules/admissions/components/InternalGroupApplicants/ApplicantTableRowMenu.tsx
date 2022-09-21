import { Button, Menu } from '@mantine/core'
import { IconDots, IconEye, IconUserMinus, IconUserPlus } from '@tabler/icons'
import { useInterviewMutations } from 'modules/admissions/mutations.hooks'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const ApplicantTableRowMenu: React.VFC<{
  applicant: CoreApplicantNode
}> = ({ applicant }) => {
  const navigate = useNavigate()
  const { setSelfAsInterviewer, removeSelfAsInterviewer } =
    useInterviewMutations()

  const handleMoreInfo = () => {
    navigate(`/admissions/applicants/${applicant.id}`)
  }
  const attendInterviewText = applicant.iAmAttendingInterview
    ? 'Meld av intervju'
    : 'Meld opp til intervju'

  const atttendInterviewIcon = applicant.iAmAttendingInterview ? (
    <IconUserMinus />
  ) : (
    <IconUserPlus />
  )

  const attendingInterviewColor = applicant.iAmAttendingInterview
    ? 'red'
    : 'green'

  const handleAttendInterview = () => {
    const { interview } = applicant
    if (interview === null) {
      toast.error('Søkeren har ikke booket intervju')
      return
    }
    const handler = applicant.iAmAttendingInterview
      ? removeSelfAsInterviewer
      : setSelfAsInterviewer

    handler({
      variables: { interviewId: interview.id },
      refetchQueries: [
        'InternalGroupApplicantsDataQuery',
        'MyInterviews',
        'MyUpcomingInterviews',
      ],
    })
  }
  return (
    <Menu position="left-start">
      <Menu.Target>
        <Button variant="outline">
          <IconDots />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={handleMoreInfo} icon={<IconEye />}>
          Mer info
        </Menu.Item>
        <Menu.Item
          onClick={handleAttendInterview}
          color={attendingInterviewColor}
          icon={atttendInterviewIcon}
        >
          {attendInterviewText}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
