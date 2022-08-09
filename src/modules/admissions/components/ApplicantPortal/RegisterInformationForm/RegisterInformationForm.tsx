import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Alert,
  Button,
  FileInput,
  Group,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { useRegisterInformationAPI } from './useRegisterInformationAPI'
import { useRegisterInformationLogic } from './useRegisterInformationLogic'

interface ResisterInformationViewProps {
  applicant: ApplicantNode
  nextStepCallback: () => void
}

export const RegisterInformationForm: React.FC<
  ResisterInformationViewProps
> = ({ applicant, nextStepCallback }) => {
  console.log(applicant)
  const { form, onSubmit } = useRegisterInformationLogic(
    useRegisterInformationAPI({ applicant, nextStepCallback })
  )
  const { formState, register, handleSubmit, getValues } = form
  const { errors, isSubmitting } = formState
  const [image, setImage] = useState<string | null>(null)

  const handleUploadImage = (file: File | null) => {
    if (file === null || file === undefined) return
    const fileReader = new FileReader()
    const s = fileReader.readAsDataURL(file)
    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }
  return (
    <Stack>
      <Title>Registrer personalia</Title>
      <Alert icon={<FontAwesomeIcon icon="info" />}>
        All personlig informasjon blir slettet i etterkant av opptaket.
      </Alert>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          error={errors?.firstName?.message}
          label="Fornavn"
          {...register('firstName')}
        />
        <TextInput
          label="Etternavn"
          error={errors?.lastName?.message}
          {...register('lastName')}
        />
        <TextInput
          label="Adresse"
          error={errors?.address?.message}
          {...register('address')}
        />
        <TextInput
          label="Hjemby"
          error={errors?.hometown?.message}
          {...register('hometown')}
        />
        <TextInput
          label="Studie"
          error={errors?.study?.message}
          {...register('study')}
        />
        <DatePicker
          label="Fødselsdato"
          placeholder="Velg en dato"
          error={errors?.dateOfBirth?.message}
          {...register('dateOfBirth')}
        />
        <TextInput
          label="Telefon"
          error={errors?.phone?.message}
          {...register('phone')}
        />
        <label>Bilde</label>
        <FileInput
          accept="image/png,image/jpeg"
          required
          error={errors?.image?.message}
          {...register('image')}
        />
        <Group position="right" mt="md">
          <Button disabled={isSubmitting} type="submit">
            Lagre informasjon
          </Button>
        </Group>
      </form>
    </Stack>
  )
}
