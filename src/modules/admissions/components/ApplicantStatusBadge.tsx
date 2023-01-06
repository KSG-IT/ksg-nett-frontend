import { Badge } from '@mantine/core'
import { ApplicantStatusValues } from 'modules/admissions/consts'
import { parseApplicantStatus } from '../parsing'
interface ApplicantStatusBadgeProps {
  applicantStatus: ApplicantStatusValues
}

function resolveStatusColor(applicantStatus: ApplicantStatusValues) {
  switch (applicantStatus) {
    case ApplicantStatusValues.EMAIL_SENT:
      return 'yellow'
    case ApplicantStatusValues.SCHEDULED_INTERVIEW:
      return 'green'
    case ApplicantStatusValues.HAS_SET_PRIORITIES:
      return 'orange'
    case ApplicantStatusValues.RETRACTED_APPLICATION:
      return 'red'
    case ApplicantStatusValues.DID_NOT_SHOW_UP_FOR_INTERVIEW:
      return 'red'
  }
}

export const ApplicantStatusBadge: React.VFC<ApplicantStatusBadgeProps> = ({
  applicantStatus,
}) => {
  return (
    <Badge color={resolveStatusColor(applicantStatus)} size="sm">
      {parseApplicantStatus(applicantStatus)}
    </Badge>
  )
}
