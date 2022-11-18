import { yupResolver } from '@hookform/resolvers/yup'
import { showNotification } from '@mantine/notifications'
import { PatchApplicantReturns } from 'modules/admissions/types.graphql'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { OnFormSubmit } from 'types/forms'
import { FILE_SIZE } from 'util/consts'
import * as yup from 'yup'

export type RegisterInformationFormData = {
  firstName: string
  lastName: string
  address: string
  hometown: string
  study: string
  gdprConsent: boolean
  dateOfBirth: Date
  phone: string
  wantsDigitalInterview: boolean
  image?: File
}

const RegisterInformationSchema = yup.object().shape({
  firstName: yup.string().required('Fornavn må fylles ut'),
  lastName: yup.string().required('Etternavn må fylles ut'),
  address: yup.string().required('Adresse må fylles ut'),
  hometown: yup.string().required('Hjemby må fylles ut'),
  gpdrConsent: yup
    .boolean()
    .oneOf([true], 'Du må godta behandling av personopplysninger'),
  study: yup.string().required('Studie må fylles ut'),
  dateOfBirth: yup.date().required('Fødselsdato må fylles ut'),
  phone: yup.string().required('Telefonnummer må fylles ut'),
  image: yup
    .mixed()
    .test(
      'FILE_SIZE',
      'Uploaded file is too big.',
      value => !value || (value && value.size <= FILE_SIZE)
    ),
  wantsDigitalInterview: yup.boolean().required(),
})

interface UseRegisterInformationLogicInput {
  defaultValues: RegisterInformationFormData
  onSubmit: OnFormSubmit<RegisterInformationFormData, PatchApplicantReturns>
}

export function useRegisterInformationLogic(
  input: UseRegisterInformationLogicInput
) {
  const { defaultValues, onSubmit } = input
  const form = useForm<RegisterInformationFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(RegisterInformationSchema),
  })

  const handleSubmit = async (data: RegisterInformationFormData) => {
    const { gdprConsent } = data

    if (!gdprConsent) {
      showNotification({
        message: 'Du må godta behandling av personopplysninger',
        color: 'yellow',
      })
      return
    }
    await toast.promise(onSubmit(data), {
      success: 'Informasjonen er lagret',
      loading: 'Lagrer...',
      error: 'Noe gikk galt',
    })
  }

  return {
    form,
    onSubmit: handleSubmit,
  }
}
