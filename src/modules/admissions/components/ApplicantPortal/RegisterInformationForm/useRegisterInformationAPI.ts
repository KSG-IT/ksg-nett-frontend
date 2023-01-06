import { showNotification } from '@mantine/notifications'
import { ApplicantStatusValues } from 'modules/admissions/consts'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { GET_APPLICATION_FROM_TOKEN } from 'modules/admissions/queries'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { format } from 'util/date-fns'
import { RegisterInformationFormData } from './useRegisterInformationLogic'

interface UseRegisterInformationAPIInput {
  applicant: ApplicantNode
}

export function useRegisterInformationAPI({
  applicant,
}: UseRegisterInformationAPIInput) {
  const { patchApplicant } = useApplicantMutations()

  async function handleSubmit(data: RegisterInformationFormData) {
    const { id } = applicant
    const input = {
      ...data,
      dateOfBirth: format(new Date(data.dateOfBirth), 'yyyy-MM-dd'),
      status: ApplicantStatusValues.HAS_REGISTERED_PROFILE,
      lastActivity: new Date(),
    }

    // TODO replace with custom mutation using applicant token
    return patchApplicant({
      variables: {
        id: id,
        input: input,
      },
      refetchQueries: [GET_APPLICATION_FROM_TOKEN],
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  const defaultValues = {
    firstName: applicant?.firstName ?? '',
    lastName: applicant?.lastName ?? '',
    address: applicant?.address ?? '',
    hometown: applicant?.hometown ?? '',
    study: applicant?.study ?? '',
    gdprConsent: applicant?.gdprConsent ?? false,
    dateOfBirth: new Date(1996, 10, 11),
    phone: applicant?.phone ?? '',
    wantsDigitalInterview: applicant?.wantsDigitalInterview ?? false,
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
