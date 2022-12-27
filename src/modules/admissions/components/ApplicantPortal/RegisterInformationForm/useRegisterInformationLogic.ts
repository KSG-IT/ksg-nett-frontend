import { yupResolver } from '@hookform/resolvers/yup'
import { showNotification } from '@mantine/notifications'
import { PatchApplicantReturns } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import * as yup from 'yup'
import { FILE_SIZE } from '../../../../../util/consts'

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
  profileImage?: File | null
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
  wantsDigitalInterview: yup.boolean().required(),
  profileImage: yup
    .mixed()
    .nullable()
    .notRequired()
    .test(
      'FILE_SIZE',
      'Filstørrelse for stor, 1 MB maks.',
      value => !value || (value && value.size <= FILE_SIZE)
    ),
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

  // Very hacky fix because upload file does not trigger re-render so UX is bad
  const [file, setFile] = useState<File | null>(null)
  const [doesNotWantImage, setDoesNotWantImage] = useState(false)

  const handleSubmit = async (data: RegisterInformationFormData) => {
    const { gdprConsent } = data

    if (!gdprConsent) {
      showNotification({
        message: 'Du må godta behandling av personopplysninger',
        color: 'yellow',
      })
      return
    }

    const mutationdata = {
      ...data,
      image: file,
    }

    if (!file) {
      if (doesNotWantImage) {
        mutationdata.image = null
      } else {
        showNotification({
          message: 'Du må laste opp bilde',
          color: 'yellow',
        })
        return
      }
    }

    await onSubmit(mutationdata)
  }

  return {
    form,
    file,
    setFile,
    doesNotWantImage,
    setDoesNotWantImage,
    onSubmit: handleSubmit,
  }
}
