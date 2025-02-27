import {
  Button,
  Checkbox,
  FileInput,
  Group,
  Image,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconFileCode } from '@tabler/icons-react'
import { MessageBox } from 'components/MessageBox'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { Controller } from 'react-hook-form'
import { useRegisterInformationAPI } from './useRegisterInformationAPI'
import { useRegisterInformationLogic } from './useRegisterInformationLogic'

interface ResisterInformationViewProps {
  applicant: ApplicantNode
}

export const RegisterInformationForm: React.FC<
  ResisterInformationViewProps
> = ({ applicant }) => {
  const {
    form,
    file,
    setFile,
    doesNotWantImage,
    setDoesNotWantImage,
    onSubmit,
  } = useRegisterInformationLogic(useRegisterInformationAPI({ applicant }))
  const { formState, control, register, handleSubmit, getValues, setValue } =
    form
  const { errors, isSubmitting } = formState

  return (
    <Stack>
      <Title>Registrer personalia</Title>
      <MessageBox type="info">
        All personlig informasjon blir slettet i etterkant av opptaket.
      </MessageBox>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack style={{ maxWidth: 900 }}>
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
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <DateInput
                label="Fødselsdato"
                placeholder="Velg en dato"
                error={errors?.dateOfBirth?.message}
                {...field}
              />
            )}
          />
          <TextInput
            label="Telefon"
            error={errors?.phone?.message}
            {...register('phone')}
          />
          <TextInput
            label="Gjenta telefon"
            error={errors?.phoneRepeated?.message}
            {...register('phoneRepeated')}
          />
          <MessageBox type="warning">
            Jeg samtykker til at personopplysninger oppgitt her blir lagret
            under behandlingen av søknaden min. Disse vil bli slettet etter
            opptaket om du ikke blir tatt opp, og maksimalt 3 uker.
          </MessageBox>

          <Checkbox
            color="samfundet-red"
            label="Samtykke om personopplysninger"
            {...register('gdprConsent')}
          />
          <Group>
            <FileInput
              value={file}
              onChange={setFile}
              label="Last opp søkerbilde"
              accept="image/png,image/jpeg,image/jpg"
              placeholder="Trykk her"
              icon={<IconFileCode />}
              clearable
            />
          </Group>
          {file && (
            <Image
              src={URL.createObjectURL(file)}
              radius={'md'}
              alt="Opptaksbildet ditt"
              width={300}
            />
          )}

          <Checkbox
            checked={doesNotWantImage}
            color="samfundet-red"
            label="Jeg ønsker ikke å laste opp et bilde"
            onChange={() => setDoesNotWantImage(!doesNotWantImage)}
          />
          {doesNotWantImage && (
            <MessageBox type="warning">
              Bilde hjelper oss med å sette ansikt på kandidatene og gjøre
              opptaksprosessen mindre upersonlig. Bilder vil også bli slettet i
              etterkant av opptaket om du ikke blir tatt opp.
            </MessageBox>
          )}

          <Group position="right" mt="md">
            <Button
              loading={isSubmitting}
              disabled={!doesNotWantImage && !file}
              type="submit"
              color="samfundet-red"
            >
              Lagre informasjon
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  )
}
