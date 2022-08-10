import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Alert,
  Button,
  FileButton,
  Group,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useRegisterInformationAPI } from './useRegisterInformationAPI'
import { useRegisterInformationLogic } from './useRegisterInformationLogic'

interface ResisterInformationViewProps {
  applicant: ApplicantNode
  nextStepCallback: () => void
}

export const RegisterInformationForm: React.FC<
  ResisterInformationViewProps
> = ({ applicant, nextStepCallback }) => {
  const { form, onSubmit } = useRegisterInformationLogic(
    useRegisterInformationAPI({ applicant, nextStepCallback })
  )
  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState

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
        <Group>
          <FileButton
            accept="image/png,image/jpeg"
            onChange={file => setValue('image', file ?? undefined)}
          >
            {props => (
              <Button leftIcon={<FontAwesomeIcon icon="upload" />} {...props}>
                Last opp bilde
              </Button>
            )}
          </FileButton>
          {getValues('image') && (getValues('image')?.name ?? '')}
        </Group>
        <Group position="right" mt="md">
          <Button disabled={isSubmitting} type="submit">
            Lagre informasjon
          </Button>
        </Group>
      </form>
    </Stack>
  )
}
