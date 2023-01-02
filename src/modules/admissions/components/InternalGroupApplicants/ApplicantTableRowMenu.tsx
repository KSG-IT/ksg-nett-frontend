import { ActionIcon, Button, Menu } from '@mantine/core'
import { IconDots, IconEye, IconUserMinus, IconUserPlus } from '@tabler/icons'
import { useInterviewMutations } from 'modules/admissions/mutations.hooks'
import { INTERNAL_GROUP_APPLICANTS_DATA } from 'modules/admissions/queries'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { MY_INTERVIEWS_QUERY } from 'modules/admissions/views'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { MY_UPCOMING_INTERVIEWS_QUERY } from '../AdmissionDashboard'

export const ApplicantTableRowMenu: React.FC<{
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
        MY_UPCOMING_INTERVIEWS_QUERY,
        INTERNAL_GROUP_APPLICANTS_DATA,
        MY_INTERVIEWS_QUERY,
      ],
    })
  }
  return (
    <Menu position="left-start">
      <Menu.Target>
        <ActionIcon>
          <IconDots size={16} stroke={1.5} />
        </ActionIcon>
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
