import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from 'components/Button'
import { format } from 'date-fns'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import * as yup from 'yup'
import { PATCH_APPLICANT } from '../mutations'
import {
  ApplicantNode,
  PatchApplicantInput,
  PatchApplicantReturns,
  PatchApplicantVariables,
} from '../types'

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

const FormInput = styled.input`
  height: 35px;
  border-radius: 8px;
`

const FormInputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
`

const FormInputArea = styled.div`
  display: flex;
  width: 100%;
  hiehgt: 100%;
  flex-direction: column;
  justify-content: center;
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
}

export const RegisterProfileForm: React.VFC<RegisterProfileFormProps> = ({
  applicant,
}) => {
  // Todo
  // 1. Implement react hook for
  // 2. Add form validation with feedback
  // 3. Add preview of image for upload
  // 4. Mutate and refetch profile
  // 5. Render book interview view or message that you will be called
  const [registerProfile] = useMutation<
    PatchApplicantReturns,
    PatchApplicantVariables
  >(PATCH_APPLICANT, { refetchQueries: ['GetApplicantFromToken'] })

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
    const input: PatchApplicantInput = {
      ...data,
      image: file,
      dateOfBirth: format(new Date(data.dateOfBirth), 'yyyy-MM-dd'),
      status: 'HAS_REGISTERED_PROFILE',
    }

    registerProfile({
      variables: { id: applicant.id, input: { ...input } },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Wrapper>
        <FormInputArea>
          <FormInputLabel>Fornavn</FormInputLabel>
          <FormInput {...register('firstName')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Etternavn</FormInputLabel>
          <FormInput {...register('lastName')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Adresse</FormInputLabel>
          <FormInput {...register('address')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Hjemby</FormInputLabel>
          <FormInput {...register('hometown')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Studie</FormInputLabel>
          <FormInput {...register('study')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Fødselsdato</FormInputLabel>
          <FormInput {...register('dateOfBirth')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Telefon</FormInputLabel>
          <FormInput {...register('phone')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Bilde</FormInputLabel>
          <input type="file" {...register('image')}></input>
        </FormInputArea>

        <FormInputArea>
          <Button type="submit">Fullfør profil</Button>
        </FormInputArea>
      </Wrapper>
    </form>
  )
}
