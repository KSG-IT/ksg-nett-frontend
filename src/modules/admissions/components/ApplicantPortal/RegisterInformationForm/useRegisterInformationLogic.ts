import { FetchResult } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { PatchApplicantReturns } from 'modules/admissions/types.graphql'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'

export type RegisterInformationFormData = {
  firstName: string
  lastName: string
  address: string
  hometown: string
  study: string
  dateOfBirth: Date
  phone: string
  image?: FileList
}

const RegisterInformationSchema = yup.object().shape({
  firstName: yup.string().required('Fornavn må fylles ut'),
  lastName: yup.string().required('Etternavn må fylles ut'),
  address: yup.string().required('Adresse må fylles ut'),
  hometown: yup.string().required('Hjemby må fylles ut'),
  study: yup.string().required('Studie må fylles ut'),
  dateOfBirth: yup.date().required('Fødselsdato må fylles ut'),
  phone: yup.string().required('Telefonnummer må fylles ut'),
  image: yup.mixed().required('Bildet må lastes opp'),
})

type OnFormSubmit<FormData, MutationReturns> = (
  data: FormData
) => Promise<FetchResult<MutationReturns>>

interface UseRegisterInformationLogicInput {
  defaultValues: RegisterInformationFormData
  nextStepCallback: () => void
  onSubmit: OnFormSubmit<RegisterInformationFormData, PatchApplicantReturns>
}

export function useRegisterInformationLogic(
  input: UseRegisterInformationLogicInput
) {
  const { defaultValues, onSubmit, nextStepCallback } = input
  const form = useForm<RegisterInformationFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(RegisterInformationSchema),
  })

  const handleSubmit = async (data: RegisterInformationFormData) => {
    await onSubmit(data)
      .then(() => nextStepCallback())
      .catch(err => {
        toast.error(err.message)
      })
  }

  return {
    form,
    onSubmit: handleSubmit,
  }
}
