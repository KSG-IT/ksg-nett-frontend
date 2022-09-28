import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'util/date-fns'
import { RegisterInformationFormData } from 'modules/admissions/components/ApplicantPortal/RegisterInformationForm/useRegisterInformationLogic'
import { PatchApplicantReturns } from 'modules/admissions/types.graphql'
import { PatchUserReturns } from 'modules/users/types'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { OnFormSubmit } from 'types/forms'
import * as yup from 'yup'

export type UserProfileFormData = {
  firstName: string
  lastName: string
  studyAddress: string
  study: string
  dateOfBirth: Date
  phone: string
  email: string
  biography: string
}

export type UserProfileCleanedData = Omit<
  UserProfileFormData,
  'dateOfBirth'
> & {
  dateOfBirth: string
}

const UserEditSchema = yup.object().shape({
  firstName: yup.string().required('Fornavn må fylles ut'),
  lastName: yup.string().required('Etternavn må fylles ut'),
  studyAddress: yup.string().required('Adresse må fylles ut'),
  study: yup.string().required('Studie må fylles ut'),
  dateOfBirth: yup.date().required('Fødselsdato må fylles ut'),
  phone: yup.string().required('Telefonnummer må fylles ut'),
  email: yup.string().required('E-post må fylles ut'),
  biography: yup.string().required('Biografi må fylles ut'),
})

interface UseRegisterInformationLogicInput {
  defaultValues: RegisterInformationFormData
  nextStepCallback: () => void
  onSubmit: OnFormSubmit<RegisterInformationFormData, PatchApplicantReturns>
}

interface UseEditLogicInput {
  defaultValues: UserProfileFormData
  onSubmit: OnFormSubmit<UserProfileCleanedData, PatchUserReturns>
  onCompletedCallback: () => void
}

export function useEditProfileLogic(input: UseEditLogicInput) {
  const { defaultValues, onSubmit, onCompletedCallback } = input
  const form = useForm<UserProfileFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(UserEditSchema),
  })

  const handleSubmit = async (data: UserProfileFormData) => {
    const cleanedData = {
      ...data,
      dateOfBirth: format(new Date(data.dateOfBirth), 'yyyy-MM-dd'),
    }
    await toast
      .promise(onSubmit(cleanedData), {
        success: 'Informasjonen er lagret',
        loading: 'Lagrer...',
        error: 'Noe gikk galt',
      })
      .then(onCompletedCallback)
  }

  return {
    form,
    onSubmit: handleSubmit,
  }
}
