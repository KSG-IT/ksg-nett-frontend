import { Button, Group, Modal, Textarea, TextInput } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import {
  IconAt,
  IconCake,
  IconHome,
  IconMapPin,
  IconPhone,
  IconSchool,
  IconSignature,
} from '@tabler/icons'
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
        padding="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            icon={<IconSignature size={14} />}
            error={errors?.firstName?.message}
            label="Fornavn"
            {...register('firstName')}
          />
          <TextInput
            icon={<IconSignature size={14} />}
            label="Etternavn"
            error={errors?.lastName?.message}
            {...register('lastName')}
          />
          <TextInput
            label="Adresse"
            icon={<IconMapPin size={14} />}
            error={errors?.studyAddress?.message}
            {...register('studyAddress')}
          />
          <TextInput
            label="Studie"
            icon={<IconSchool size={14} />}
            error={errors?.study?.message}
            {...register('study')}
          />
          <DatePicker
            label="Fødselsdato"
            placeholder="Velg en dato"
            icon={<IconCake size={14} />}
            error={errors?.dateOfBirth?.message}
            defaultValue={getValues('dateOfBirth')}
            onChange={date => date && setValue('dateOfBirth', new Date(date))}
            allowFreeInput
          />
          <TextInput
            label="Telefon"
            icon={<IconPhone size={14} />}
            error={errors?.phone?.message}
            {...register('phone')}
          />
          <TextInput
            label="Epostadresse"
            icon={<IconAt size={14} />}
            error={errors?.email?.message}
            {...register('email')}
          />
          <Textarea
            autosize
            label="Om meg"
            error={errors?.biography?.message}
            {...register('biography')}
          />
          <Group position="apart" mt="md">
            <Button
              variant="outline"
              color="orange"
              onClick={() => setOpened(false)}
            >
              Lukk
            </Button>
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
          variant="light"
          color={'orange'}
          onClick={() => setOpened(true)}
        >
          Endre
        </Button>
      </Group>
    </>
  )
}
