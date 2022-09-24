import { Button, Group, Modal, Textarea, TextInput } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { UserNode } from 'modules/users/types'
import { useState } from 'react'
import { useEditProfileAPI } from './UserEditAPI'
import { useEditProfileLogic } from './UserEditLogic'

interface EditProfileViewProps {
  user: UserNode
}

export const UserEditForm: React.FC<EditProfileViewProps> = ({ user }) => {
  const { form, onSubmit } = useEditProfileLogic(useEditProfileAPI(user))
  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Rediger profilinformasjon"
        size="lg"
      >
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
            error={errors?.studyAddress?.message}
            {...register('studyAddress')}
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
            defaultValue={getValues('dateOfBirth')}
            onChange={date => date && setValue('dateOfBirth', new Date(date))}
            allowFreeInput
          />
          <TextInput
            label="Telefon"
            error={errors?.phone?.message}
            {...register('phone')}
          />
          <TextInput
            label="Epostadresse"
            error={errors?.email?.message}
            {...register('email')}
          />
          <Textarea
            autosize
            label="Om meg"
            error={errors?.biography?.message}
            {...register('biography')}
          />
          <Group position="right" mt="md">
            <Button
              variant="gradient"
              gradient={{ from: 'coral', to: 'yellow', deg: 15 }}
              disabled={isSubmitting}
              type="submit"
              onClick={() => setOpened(false)}
            >
              Lagre informasjon
            </Button>
          </Group>
        </form>
      </Modal>
      <Group position="center">
        <Button
          variant="gradient"
          gradient={{ from: 'coral', to: 'yellow', deg: 15 }}
          onClick={() => setOpened(true)}
        >
          Rediger profil
        </Button>
      </Group>
    </>
  )
}
