import { zodResolver } from '@hookform/resolvers/zod'
import { PatchApplicantReturns } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import { maxFileSize, requiredIsoDate, requiredString } from 'util/validation'
import { z } from 'zod'

const RegisterInformationSchema = z
  .object({
    firstName: requiredString('Fornavn må fylles ut'),
    lastName: requiredString('Etternavn må fylles ut'),
    address: requiredString('Adresse må fylles ut'),
    hometown: requiredString('Hjemby må fylles ut'),
    study: requiredString('Studie må fylles ut'),
    gdprConsent: z
      .boolean()
      .refine(
        consent => consent,
        'Du må godta behandling av personopplysninger'
      ),
    dateOfBirth: requiredIsoDate('Fødselsdato må fylles ut'),
    phone: requiredString('Telefonnummer må fylles ut'),
    phoneRepeated: requiredString('Telefonnummer må fylles ut på nytt'),
    wantsDigitalInterview: z.boolean(),
    profileImage: maxFileSize(),
  })
  .refine(data => data.phone === data.phoneRepeated, {
    message: 'Telefonnummer må være likt',
    path: ['phoneRepeated'],
  })

export type RegisterInformationFormValues = z.input<
  typeof RegisterInformationSchema
>
type RegisterInformationFormData = z.output<typeof RegisterInformationSchema>

export type RegisterInformationSubmitData = Omit<
  RegisterInformationFormData,
  'phoneRepeated'
> & { image: File | null }

interface UseRegisterInformationLogicInput {
  defaultValues: RegisterInformationFormValues
  onSubmit: OnFormSubmit<RegisterInformationSubmitData, PatchApplicantReturns>
}

export function useRegisterInformationLogic(
  input: UseRegisterInformationLogicInput
) {
  const { defaultValues, onSubmit } = input
  const form = useForm<
    RegisterInformationFormValues,
    unknown,
    RegisterInformationFormData
  >({
    mode: 'onSubmit',
    defaultValues,
    resolver: zodResolver(RegisterInformationSchema),
  })

  // Very hacky fix because upload file does not trigger re-render so UX is bad
  const [file, setFile] = useState<File | null>(null)
  const [doesNotWantImage, setDoesNotWantImage] = useState(false)

  const handleSubmit = async (data: RegisterInformationFormData) => {
    const { phoneRepeated, ...rest } = data
    await onSubmit({ ...rest, image: doesNotWantImage ? null : file })
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
