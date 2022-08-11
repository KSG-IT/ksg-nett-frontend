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
  /**
   * Need a way to resolve whether or not we are in this interview@
   * I see one of two ways
   * 1. We resolve and display all interviewrs and check
   *    if our own ID matchers
   * 2. We provide an argument in the query which returns
   *    a boolean if we already are attending this interview
   *
   * We try number 2 and maybe refactor for the oter one in the future
   * because less work
   */

  // Does not consider if the interview is finished. Should probably remove
  // the option or gray it out if thats the case

  const handleMoreInfo = () => {
    history.push(`/admissions/applicants/${applicant.id}`)
  }
  const attendInterviewText = applicant.iAmAttendingInterview
    ? 'Meld av intervju'
    : 'Meld opp til intervju'

  const atttendInterviewIcon = applicant.iAmAttendingInterview
    ? 'user-minus'
    : 'user-plus'

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
      refetchQueries: ['InternalGroupApplicantsDataQuery'],
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
          icon={<FontAwesomeIcon icon={atttendInterviewIcon} />}
        >
          {attendInterviewText}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
