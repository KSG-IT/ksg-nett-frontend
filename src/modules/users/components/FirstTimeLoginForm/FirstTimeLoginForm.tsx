import { Button, Stack, Textarea } from '@mantine/core'

import { zodResolver } from '@hookform/resolvers/zod'
import { showNotification } from '@mantine/notifications'
import { useUserMutations } from 'modules/users/mutations.hooks'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ME_QUERY } from 'modules/users/queries'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  aboutMe: z
    .string()
    .min(1, 'Dette feltet er påkrevd')
    .max(300, 'Maks 300 tegn'),
})

type FirstTimeLoginFormData = z.infer<typeof schema>

export const FirstTimeLoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      aboutMe: '',
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  })
  const navigate = useNavigate()

  const { updateAboutMe, updateAboutMeLoading } = useUserMutations()

  async function handleUpdateAboutMe(data: FirstTimeLoginFormData) {
    return updateAboutMe({
      variables: {
        aboutMe: data.aboutMe,
      },
      refetchQueries: [ME_QUERY],
      onCompleted() {
        showNotification({
          title: 'Informasjonen ble oppdatert',
          message: '',
          color: 'green',
        })
        navigate('/dashboard')
      },
      onError({ message }) {
        showNotification({
          title: 'Kunne ikke oppdatere informasjonen',
          message,
        })
      },
    })
  }

  async function onSubmit(data: FirstTimeLoginFormData) {
    await handleUpdateAboutMe(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Textarea
          autosize
          label="Hva er din mest kontroversielle mening?"
          minRows={8}
          error={errors?.aboutMe?.message}
          {...register('aboutMe', {})}
        />
        <Button
          loading={updateAboutMeLoading}
          disabled={!isValid}
          type="submit"
        >
          Lagre
        </Button>
      </Stack>
    </form>
  )
}
