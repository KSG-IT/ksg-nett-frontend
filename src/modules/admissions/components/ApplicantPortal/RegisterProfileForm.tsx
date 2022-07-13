import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Button,
  Group,
  Input,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { format } from 'date-fns'
import { ApplicantStatusValues } from 'modules/admissions/consts'
import { usePatchApplicant } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import * as yup from 'yup'

const Wrapper = styled.div`
  display: grid;
  max-width: 800px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(5, 50px);
  gap: 5px;

  ${props => props.theme.media.mobile} {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
  }
`

const FormInputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
`

type RegisterProfileFormInput = {
  firstName: string
  lastName: string
  address: string
  hometown: string
  study: string
  dateOfBirth: Date
  phone: string
  image: FileList
}

interface RegisterProfileFormProps {
  applicant: ApplicantNode
  nextStepCallback: () => void
}

export const RegisterProfileForm: React.VFC<RegisterProfileFormProps> = ({
  applicant,
  nextStepCallback,
}) => {
  // Todo
  // 1. Implement react hook for
  // 2. Add form validation with feedback
  // 3. Add preview of image for upload
  // 4. Mutate and refetch profile
  // 5. Render book interview view or message that you will be called

  const { patchApplicant } = usePatchApplicant()

  let schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    address: yup.string().required(),
    hometown: yup.string().required(),
    study: yup.string().required(),
    dateOfBirth: yup.date().required(),
    phone: yup.string().required(),
    image: yup.mixed().required(),
  })

  const { register, handleSubmit } = useForm<RegisterProfileFormInput>({
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<RegisterProfileFormInput> = data => {
    const fileList = data.image
    const file = fileList[0]
    const input = {
      ...data,
      image: file,
      dateOfBirth: format(new Date(data.dateOfBirth), 'yyyy-MM-dd'),
      status: 'HAS_REGISTERED_PROFILE' as ApplicantStatusValues,
    }

    patchApplicant({
      variables: {
        id: applicant.id,
        input: { ...input },
      },
      refetchQueries: ['GetApplicantFromToken'],
    })
  }

  return (
    <Stack>
      <Title>Registrer personalia</Title>
      <Alert icon={<FontAwesomeIcon icon="info" />}>
        All personlig informasjon blir slettet i etterkant av opptaket.
      </Alert>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextInput label="Fornavn" {...register('firstName')} />
        <TextInput label="Etternavn" {...register('lastName')} />
        <TextInput label="Adresse" {...register('address')} />
        <TextInput label="Hjemby" {...register('hometown')} />
        <TextInput label="Studie" {...register('study')} />
        <DatePicker
          label="Fødselsdato"
          placeholder="Velg en dato"
          {...register('dateOfBirth')}
        />
        <TextInput label="Telefon" {...register('phone')} />
        <FormInputLabel>Bilde</FormInputLabel>
        <Input type="file" {...register('image')}></Input>
        <Group position="right" mt="md">
          <Button type="submit">Lagre informasjon</Button>
        </Group>
      </form>
    </Stack>
  )
}
