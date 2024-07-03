import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Paper, Text, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useLoginMutations } from '../mutations.hooks'
import { createStyles } from '@mantine/emotion'

let schema = yup.object().shape({
  username: yup.string().required('Du må skrive inn en epost'),
})

type ResetMyPasswordInput = {
  username: string
}

export const ForgotPassword: React.FC = () => {
  const { classes } = useStyles()
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetMyPasswordInput>({ resolver: yupResolver(schema) })

  const { resetPassword, resetPasswordLoading } = useLoginMutations()

  function handleResetPassword(data: ResetMyPasswordInput) {
    const { username } = data
    resetPassword({
      variables: {
        username,
      },
      onCompleted() {
        setEmailSent(true)
      },
    })
  }

  const onSubmit: SubmitHandler<ResetMyPasswordInput> = data =>
    handleResetPassword(data)

  if (emailSent) {
    return (
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title order={3}>Glemt passord</Title>
          <Text>
            Om eposten din ligger inne i systemet vil du motta en epost med
            videre instruksjoner
          </Text>
          <Button onClick={() => setEmailSent(false)}>Send på nytt</Button>
        </Paper>
      </div>
    )
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Glemt passord
        </Title>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextInput
            label="Epost"
            size="md"
            error={errors.username?.message}
            {...register('username')}
          />
          <Button
            color="samfundet-red"
            type="submit"
            fullWidth
            mt="md"
            loading={resetPasswordLoading}
            size="md"
          >
            Nullstill passord
          </Button>
        </form>
      </Paper>
    </div>
  )
}

const useStyles = createStyles(theme => ({
  wrapper: {
    height: '100vh',
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    height: '100vh',
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))
