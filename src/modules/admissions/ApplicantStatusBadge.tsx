import styled from 'styled-components'
import { ApplicantStatus } from './types'

const Wrapper = styled.div`
  border: 1px solid;
  border-radius: 2px;
  color: ${props => props.theme.colors.purpleAction};
  /* Need to add color variants depending on status  */
`

const handleStatusLabelText = (status: ApplicantStatus) => {
  switch (status) {
    case 'EMAIL_SENT':
      return 'Epost'

    case 'SCHEDULED_INTERVIEW':
      return 'Intervju'

    case 'HAS_REGISTERED_PROFILE':
      return 'Registrert'

    case 'ACCEPTED':
      return 'Akseptert'

    case 'DID_NOT_SHOW_UP_FOR_INTERVIEW':
      return 'Ikke møtt'

    case 'REJECTED':
      return 'Avslått'

    case 'RETRACTED_APPLICATION':
      return 'Trukket'

    case 'INTERVIEW_FINISHED':
      return 'Hatt intervju'

    case 'TO_BE_CALLED':
      return 'Skal ringes'
  }
}

interface ApplicantStatusBadgeProps {
  applicantStatus: ApplicantStatus
}

export const ApplicantStatusBadge: React.VFC<ApplicantStatusBadgeProps> = ({
  applicantStatus,
}) => {
  return <Wrapper>{handleStatusLabelText(applicantStatus)}</Wrapper>
}
