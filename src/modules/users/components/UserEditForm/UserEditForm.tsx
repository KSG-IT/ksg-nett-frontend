import { Button, Group, Textarea, TextInput } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import {
  IconAt,
  IconCake,
  IconMapPin,
  IconPhone,
  IconSchool,
  IconSignature,
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
        <Button variant="outline" color="orange" onClick={onCompletedCallback}>
          Lukk
        </Button>
        <Button
          variant="gradient"
          gradient={{ from: 'coral', to: 'yellow', deg: 15 }}
          disabled={isSubmitting}
          type="submit"
        >
          Lagre informasjon
        </Button>
      </Group>
    </form>
  )
}
