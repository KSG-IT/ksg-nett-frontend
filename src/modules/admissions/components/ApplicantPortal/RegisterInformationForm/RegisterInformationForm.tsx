import {
  Button,
  Checkbox,
  FileButton,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconUpload } from '@tabler/icons'
import { MessageBox } from 'components/MessageBox'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { useRegisterInformationAPI } from './useRegisterInformationAPI'
import { useRegisterInformationLogic } from './useRegisterInformationLogic'

interface ResisterInformationViewProps {
  applicant: ApplicantNode
}

export const RegisterInformationForm: React.FC<
  ResisterInformationViewProps
> = ({ applicant }) => {
  const { form, onSubmit } = useRegisterInformationLogic(
    useRegisterInformationAPI({ applicant })
  )
  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState
  const [doesNotWantImage, setDoesNotWantImage] = useState(false)

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
          <DatePicker
            label="Fødselsdato"
            placeholder="Velg en dato"
            error={errors?.dateOfBirth?.message}
            // Not enjoying this hack here
            value={getValues('dateOfBirth')}
            onChange={date => date && setValue('dateOfBirth', date)}
          />
          <TextInput
            label="Telefon"
            error={errors?.phone?.message}
            {...register('phone')}
          />
          <Checkbox
            color="samfundet-red"
            label="Ønsker digitalt intervju"
            {...register('wantsDigitalInterview')}
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
            <FileButton
              accept="image/png,image/jpeg,image/jpg"
              onChange={file => setValue('image', file ?? undefined)}
            >
              {props => (
                <Button
                  color="samfundet-red"
                  leftIcon={<IconUpload />}
                  {...props}
                >
                  Last opp bilde
                </Button>
              )}
            </FileButton>
            {getValues('image') && (getValues('image')?.name ?? '')}
            {errors?.image && <Text color="red">Bilde må lastes opp</Text>}
          </Group>

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
              disabled={!doesNotWantImage && !getValues('image')}
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
