import { useMutation } from '@apollo/client'
import { Button } from 'components/Button'
import { useState } from 'react'
import styled from 'styled-components'
import { RE_SEND_APPLICATION_TOKEN } from '../mutation'
import {
  ReSendApplicationTokenReturns,
  ReSendApplicationTokenVariables,
} from '../types'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const EmailInput = styled.input``

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
      <Wrapper>
        Følg med på innboksen din
        <SendAgainLabel onClick={() => setEmailSent(!false)}>
          Send epost på nytt?
        </SendAgainLabel>
      </Wrapper>
    )

  return (
    <Wrapper>
      <EmailInput value={email} onChange={evt => setEmail(evt.target.value)} />
      <Button onClick={handleSendResetEmail}>Send lenke på nytt</Button>
    </Wrapper>
  )
}
