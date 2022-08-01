import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuItem } from '@mantine/core'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { useHistory } from 'react-router-dom'

export const ApplicantTableRowMenu: React.VFC<{
  applicant: CoreApplicantNode
}> = ({ applicant }) => {
  const history = useHistory()
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
  const txt = applicant.iAmAttendingInterview ? 'Meld av' : 'Meld opp'
  return (
    <Menu>
      <MenuItem onClick={handleMoreInfo} icon={<FontAwesomeIcon icon="eye" />}>
        Mer info
      </MenuItem>
      <MenuItem>{txt}</MenuItem>
    </Menu>
  )
}
