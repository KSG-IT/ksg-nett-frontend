import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Button, Center, Stack, TextInput, Title } from '@mantine/core'
import { RE_SEND_APPLICATION_TOKEN } from 'modules/admissions/mutations'
import {
  ReSendApplicationTokenReturns,
  ReSendApplicationTokenVariables,
} from 'modules/admissions/types.graphql'
import { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const SendAgainLabel = styled.label`
  text-decoration: underline;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.gray2};

  :hover {
    cursor: pointer;
  }
`

export const ReSendApplicantTokenForm: React.VFC = () => {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [sendResetMail] = useMutation<
    ReSendApplicationTokenReturns,
    ReSendApplicationTokenVariables
  >(RE_SEND_APPLICATION_TOKEN, { variables: { email: email } })

  const handleSendResetEmail = () => {
    setEmailSent(true)
    sendResetMail()
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
          <Button
            onClick={() => setEmailSent(false)}
            leftIcon={<FontAwesomeIcon icon="paper-plane" />}
          >
            Send epost på nytt?
          </Button>
        </Stack>
      </Center>
    )

  return (
    <Center>
      <Stack>
        <Title>KSG søkerportal</Title>
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
