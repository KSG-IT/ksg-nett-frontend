import {
  Button,
  createStyles,
  Paper,
  PasswordInput,
  Title,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setLoginToken } from 'util/auth'
import { useJwtTokenFromQueryString } from '../hooks'
import { useLoginMutations } from '../mutations.hooks'

export const ChangePasswordWithToken: React.FC = () => {
  const { classes } = useStyles()
  const [newPassword, setNewPassword] = useState('')
  const [repeatNewPassword, setRepeatNewPassword] = useState('')
  const { token } = useJwtTokenFromQueryString()
  const navigate = useNavigate()

  const { resetPasswordByToken, resetPasswordByTokenLoading } =
    useLoginMutations()

  function handleResetPassword() {
    if (newPassword !== repeatNewPassword) {
      showNotification({
        title: 'Passordfeil',
        message: 'Passordene er ikke like',
      })
      return
    }

    resetPasswordByToken({
      variables: {
        token,
        newPassword: newPassword,
      },
      onCompleted({ resetPasswordByToken }) {
        setLoginToken(resetPasswordByToken.loginToken)
        navigate('/dashboard')
        window.location.reload()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message: message,
        })
      },
    })
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
          Nytt passord
        </Title>
        <PasswordInput
          value={newPassword}
          label="Nytt passord"
          size="md"
          onChange={evt => setNewPassword(evt.target.value)}
        />
        <PasswordInput
          value={repeatNewPassword}
          label="Gjenta nytt passord"
          size="md"
          onChange={evt => setRepeatNewPassword(evt.target.value)}
        />
        <Button
          color="samfundet-red"
          type="submit"
          fullWidth
          mt="md"
          loading={resetPasswordByTokenLoading}
          size="md"
          onClick={handleResetPassword}
        >
          Lagre nytt passord
        </Button>
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
