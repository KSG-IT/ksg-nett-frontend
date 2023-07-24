import { useMutation } from '@apollo/client'
import { Alert, Button, Center, Stack, TextInput, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconPlane } from '@tabler/icons'
import { MessageBox } from 'components/MessageBox'
import { RE_SEND_APPLICATION_TOKEN } from 'modules/admissions/mutations'
import {
  ReSendApplicationTokenReturns,
  ReSendApplicationTokenVariables,
} from 'modules/admissions/types.graphql'
import { useState } from 'react'

export const ReSendApplicantTokenForm: React.VFC = () => {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [sendResetMail] = useMutation<
    ReSendApplicationTokenReturns,
    ReSendApplicationTokenVariables
  >(RE_SEND_APPLICATION_TOKEN)

  const handleSendResetEmail = () => {
    const parsedEmail = email.trim()

    if (parsedEmail === '') {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Du må skrive inn en epost',
        color: 'red',
      })
      return
    }
    sendResetMail({ variables: { email: parsedEmail } })
      .then(() => {
        showNotification({
          title: 'Suksess',
          message: 'Epost sendt!',
          color: 'green',
        })
        setEmailSent(true)
        setEmail('')
      })
      .catch(() => {
        showNotification({
          title: 'Noe gikk galt',
          message: 'Kunne ikke sende epost',
          color: 'red',
        })
      })
  }

  if (emailSent)
    return (
      <Center>
        <Stack>
          <Title>KSG søkerportal</Title>
          <Alert color="green">
            Følg med på inboxen din. Om eposten din er registrert i systemet
            vårt skal du straks få en epost.
          </Alert>
          <Button onClick={() => setEmailSent(false)} leftIcon={<IconPlane />}>
            Send epost på nytt?
          </Button>
        </Stack>
      </Center>
    )

  return (
    <Center p="lg">
      <Stack style={{ maxWidth: '600px' }}>
        <Title>KSG søkerportal</Title>
        <MessageBox type="info">
          Følg med på inboxen din. Om eposten din er registrert i systemet vårt
          skal du straks få en epost. Bruk samme epost du har brukt for å
          registrere deg på <b>Samfundet</b> sine nettsider.
        </MessageBox>
        <TextInput
          value={email}
          onChange={evt => setEmail(evt.target.value)}
          label="Epost"
        />
        <Button onClick={handleSendResetEmail}>Send lenke på nytt</Button>
      </Stack>
    </Center>
  )
}
