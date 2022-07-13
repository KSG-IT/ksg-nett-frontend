import { Badge } from '@mantine/core'
import { ApplicantStatusValues } from 'modules/admissions/consts'
import { parseApplicantStatus } from '../parsing'
interface ApplicantStatusBadgeProps {
  applicantStatus: ApplicantStatusValues
}

export const ApplicantStatusBadge: React.VFC<ApplicantStatusBadgeProps> = ({
  applicantStatus,
}) => {
  return <Badge size="lg">{parseApplicantStatus(applicantStatus)}</Badge>
}
