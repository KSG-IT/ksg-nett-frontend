import { Button, FileInput, Group, SimpleGrid, TextInput } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import {
  IconAt,
  IconCake,
  IconHome,
  IconMapPin,
  IconPhone,
  IconSchool,
  IconSignature,
  IconUpload,
} from '@tabler/icons'
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
    ...useEditProfileAPI(user),
    onCompletedCallback,
  })
  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 600, cols: 1, spacing: 'sm' }]}
      >
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
          label="Hjemby"
          icon={<IconHome size={14} />}
          error={errors?.homeTown?.message}
          {...register('homeTown')}
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

        <FileInput
          placeholder="Profilbilde"
          label="Profilbilde"
          icon={<IconUpload size={14} />}
          error={errors?.profileImage?.message}
          accept="image/png,image/jpeg,image/jpg"
          onChange={value => value && setValue('profileImage', value)}
        />
      </SimpleGrid>

      <Group position="apart" mt="md">
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
