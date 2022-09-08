import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Menu } from '@mantine/core'
import { useInterviewMutations } from 'modules/admissions/mutations.hooks'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import toast from 'react-hot-toast'
import { useHistory } from 'react-router-dom'

export const ApplicantTableRowMenu: React.VFC<{
  applicant: CoreApplicantNode
}> = ({ applicant }) => {
  const history = useHistory()
  const { setSelfAsInterviewer, removeSelfAsInterviewer } =
    useInterviewMutations()

  const handleMoreInfo = () => {
    history.push(`/admissions/applicants/${applicant.id}`)
  }
  const attendInterviewText = applicant.iAmAttendingInterview
    ? 'Meld av intervju'
    : 'Meld opp til intervju'

  const atttendInterviewIcon = applicant.iAmAttendingInterview
    ? 'user-minus'
    : 'user-plus'

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
          <FontAwesomeIcon icon="ellipsis-h" />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={handleMoreInfo}
          icon={<FontAwesomeIcon icon="eye" />}
        >
          Mer info
        </Menu.Item>
        <Menu.Item
          onClick={handleAttendInterview}
          color={attendingInterviewColor}
          icon={<FontAwesomeIcon icon={atttendInterviewIcon} />}
        >
          {attendInterviewText}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
