import { ApplicantNode } from 'modules/admissions/types.graphql'
import { RegisterInformationAPI } from './RegisterInformationAPI'

interface RegisterInformationFormProps {
  applicant: ApplicantNode
  nextStepCallback: () => void
}

// Re-exposrt it under a more sensible name
export const RegisterInformationForm: React.VFC<
  RegisterInformationFormProps
> = ({ applicant }) => {
  return <RegisterInformationAPI applicant={applicant} />
}
