import { useApolloClient } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  createStyles,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from 'store'
import { setLoginToken } from 'util/auth'
import * as yup from 'yup'
import { useJwtTokenFromQueryString } from '../hooks'
import { useLoginMutations } from '../mutations.hooks'

let schema = yup.object().shape({
  username: yup.string().required('Du må skrive et brukernavn'),
  password: yup.string().required('Du må skrive et passord'),
})

type LoginInput = {
  username: string
  password: string
}

export const Login: React.FC = () => {
  const { classes } = useStyles()
  const client = useApolloClient()

  const { token } = useJwtTokenFromQueryString()
  const navigate = useNavigate()
  const firstRender = useRef(true)

  useEffect(() => {
    if (!firstRender.current) return

    firstRender.current = false

    if (token) {
      setLoginToken(token)
      navigate('/dashboard')
      window.location.reload()
    }
  }, [token])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: yupResolver(schema) })
  const setUser = useStore(state => state.setUser)

  const { login, loginLoading } = useLoginMutations()

  function handleLogin(data: LoginInput) {
    const { username, password } = data
    login({
      variables: {
        username,
        password,
      },
      onCompleted({ login }) {
        const { ok, token, user } = login
        if (!ok) {
          showNotification({
            title: 'Noe gikk galt',
            message: 'Kunne ikke logge inn',
          })
          return
        }
        setLoginToken(token!)
        setUser(user!)
        client.resetStore()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message: message,
        })
      },
    })
  }

  const onSubmit: SubmitHandler<LoginInput> = data => handleLogin(data)

  return (
    <ErrorBoundary FallbackComponent={() => <div>Oida, her gikk noe galt</div>}>
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title
            order={2}
            className={classes.title}
            align="center"
            mt="md"
            mb={50}
          >
            Velkommen til KSG-nett!
          </Title>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextInput
              label="Brukernavn"
              placeholder="hello@gmail.com"
              size="md"
              error={errors.username?.message}
              {...register('username')}
            />
            <PasswordInput
              label="Passord"
              placeholder="Passordet ditt"
              mt="md"
              size="md"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button
              type="submit"
              color="samfundet-red"
              fullWidth
              mt="xl"
              size="md"
              loading={loginLoading}
            >
              Login
            </Button>
          </form>

          <Text align="center" mt="md">
            Glemt passordet ditt?{' '}
            <Link to="/forgot-password" color="samfundet-red">
              Trykk her
            </Link>
          </Text>
        </Paper>
      </div>
    </ErrorBoundary>
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
