import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Checkbox,
  Group,
  Input,
  Modal,
  ModalProps,
  Stack,
  Title,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MessageBox } from 'components/MessageBox'
import { useUserMutations } from 'modules/users/mutations.hooks'
import { useForm } from 'react-hook-form'

import * as yup from 'yup'

const CreateUserSchema = yup.object().shape({
  email: yup.string().email('Ugyldig epost').required('Påkrevd'),
  firstName: yup.string().min(1).max(16).required('Påkrevd'),
  lastName: yup.string().min(1).max(20).required('Påkrevd'),
  sendWelcomeEmail: yup.boolean(),
})

type CreateUserForm = {
  email: string
  firstName: string
  lastName: string
  sendWelcomeEmail: boolean
}

export const AddSingleUserModal = ({ onClose, opened }: ModalProps) => {
  const { inviteNewUser, inviteNewUserLoading } = useUserMutations()
  const { handleSubmit, register } = useForm<CreateUserForm>({
    resolver: yupResolver(CreateUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      sendWelcomeEmail: true,
    },
  })
  async function onSubmit(data: CreateUserForm) {
    await inviteNewUser({
      variables: data,
      onCompleted({ inviteNewUser: { user } }) {
        showNotification({
          title: 'Bruker opprettet!',
          color: 'green',
          message: data.sendWelcomeEmail
            ? `Velkomstepost for ${user.firstName} ${user.lastName} har blitt sendt til ${user.email}`
            : '',
        })
        onClose()
      },

      onError({ message }) {
        let parsedMessage = message
        if (message === 'UNIQUE constraint failed: users_user.email') {
          parsedMessage = 'En bruker med denne eposten eksisterer allerede'
        }
        showNotification({
          title: 'Noe gikk galt',
          message: parsedMessage,
          color: 'red',
        })
      },
    })
  }
  return (
    <Modal onClose={onClose} opened={opened}>
      <Stack mb="md" spacing={'xs'}>
        <Title order={2}>Legg til enkelt bruker</Title>
        <MessageBox type="info">
          Har du behov for å legge til en enkelt bruker utenom opptaket? Da er
          du riktig sted!
        </MessageBox>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={'xs'}>
          <label htmlFor="email">Epost</label>
          <Input id="email" {...register('email')} />
          <label htmlFor="first-name">Fornavn</label>
          <Input {...register('firstName')} />
          <label htmlFor="last-name">Etternavn</label>
          <Input {...register('lastName')} />
          <Checkbox
            label="Send velkomstepost"
            {...register('sendWelcomeEmail')}
          />
          <Group>
            <Button color="gray" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit" loading={inviteNewUserLoading}>
              Opprett
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
