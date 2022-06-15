import { Badge } from '@mantine/core'
import { parseApplicantStatus } from './parsing'
import { ApplicantStatus } from './types'
interface ApplicantStatusBadgeProps {
  applicantStatus: ApplicantStatus
}

export const ApplicantStatusBadge: React.VFC<ApplicantStatusBadgeProps> = ({
  applicantStatus,
}) => {
  return <Badge size="lg">{parseApplicantStatus(applicantStatus)}</Badge>
}
