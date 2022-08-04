import { format } from 'date-fns'
import { ApplicantStatusValues } from 'modules/admissions/consts'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import {
  RegisterInformationFormData,
  RegisterInformationLogic,
} from './RegisterInformationLogic'

interface RegisterInformationAPIProps {
  applicant: ApplicantNode
}

export const RegisterInformationAPI: React.VFC<RegisterInformationAPIProps> = ({
  applicant,
}) => {
  const { patchApplicant } = useApplicantMutations()

  const handleSubmit = async (data: RegisterInformationFormData) => {
    const { id } = applicant

    const input = {
      ...data,
      image: data.image,
      dateOfBirth: format(new Date(data.dateOfBirth), 'yyyy-MM-dd'),
      status: ApplicantStatusValues.HAS_REGISTERED_PROFILE,
    }

    return patchApplicant({
      variables: {
        id: id,
        input: input,
      },
      refetchQueries: ['GetApplicantFromToken'],
    })
  }

  const defaultValues = {
    firstName: '',
    lastName: '',
    address: '',
    hometown: '',
    study: '',
    dateOfBirth: new Date(),
    phone: '',
  }

  return (
    <RegisterInformationLogic
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
    />
  )
}
