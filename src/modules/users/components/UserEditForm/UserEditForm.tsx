import { Button, FileInput, Group, SimpleGrid, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { format } from 'date-fns'
import {
  IconAt,
  IconCake,
  IconHome,
  IconMapPin,
  IconPhone,
  IconSchool,
  IconSignature,
  IconUpload,
} from '@tabler/icons-react'
import { UserNode } from 'modules/users/types'
import { useEditProfileAPI } from './useUserEditAPI'
import { useEditProfileLogic } from './useUserEditLogic'

interface EditProfileViewProps {
  user: UserNode
  onCompletedCallback: () => void
}

export const UserEditForm: React.FC<EditProfileViewProps> = ({
  user,
  onCompletedCallback,
}) => {
  const { form, onSubmit } = useEditProfileLogic({
    ...useEditProfileAPI({ user, onCompletedCallback }),
    onCompletedCallback,
  })
  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          leftSection={<IconSignature size={14} />}
          error={errors?.firstName?.message}
          label="Fornavn"
          {...register('firstName')}
        />
        <TextInput
          leftSection={<IconSignature size={14} />}
          label="Etternavn"
          error={errors?.lastName?.message}
          {...register('lastName')}
        />
        <TextInput
          label={'Kallenavn'}
          leftSection={<IconSignature size={14} />}
          error={errors?.nickname?.message}
          {...register('nickname')}
        />
        <TextInput
          label="Hjemby"
          leftSection={<IconHome size={14} />}
          error={errors?.homeTown?.message}
          {...register('homeTown')}
        />
        <TextInput
          label="Adresse"
          leftSection={<IconMapPin size={14} />}
          error={errors?.studyAddress?.message}
          {...register('studyAddress')}
        />
        <TextInput
          label="Studie"
          leftSection={<IconSchool size={14} />}
          error={errors?.study?.message}
          {...register('study')}
        />
        <DateInput
          label="Fødselsdato"
          placeholder="Velg en dato"
          leftSection={<IconCake size={14} />}
          error={errors?.dateOfBirth?.message}
          defaultValue={
            getValues('dateOfBirth')
              ? format(getValues('dateOfBirth')!, 'yyyy-MM-dd')
              : undefined
          }
          onChange={date => date && setValue('dateOfBirth', new Date(date))}
        />
        <TextInput
          label="Telefon"
          leftSection={<IconPhone size={14} />}
          error={errors?.phone?.message}
          {...register('phone')}
        />
        <TextInput
          label="Epostadresse"
          leftSection={<IconAt size={14} />}
          error={errors?.email?.message}
          {...register('email')}
        />

        <FileInput
          placeholder="Profilbilde"
          label="Profilbilde"
          leftSection={<IconUpload size={14} />}
          error={errors?.profileImage?.message}
          accept="image/png,image/jpeg,image/jpg"
          onChange={value => value && setValue('profileImage', value)}
        />
      </SimpleGrid>

      <Group justify="space-between" mt="md">
        <Button
          variant="outline"
          color="samfundet-red"
          onClick={onCompletedCallback}
        >
          Lukk
        </Button>
        <Button
          variant="gradient"
          gradient={{ from: 'samfundet-red.6', to: 'samfundet-red.4', deg: 15 }}
          disabled={isSubmitting}
          type="submit"
        >
          Lagre informasjon
        </Button>
      </Group>
    </form>
  )
}
