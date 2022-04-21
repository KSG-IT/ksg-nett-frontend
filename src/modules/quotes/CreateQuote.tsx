import { useMutation } from '@apollo/client'
import { Button } from 'components/Button'
import { UserMultiSelect } from 'components/Select'
import { formatISO } from 'date-fns'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { CreateQuoteReturns, CreateQuoteVariables } from '.'
import { CREATE_QUOTE } from './mutations'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  width: 100%;
`

const Title = styled.h1``

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
  padding: 15px;
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow.default};
`

const QuoteTextArea = styled.textarea`
  padding: 5px;
  background-color: ${props => props.theme.colors.background};
  outline: none;
  border: none;
  border-radius: 10px;
  height: 100px;
  font-size: 16px;
  box-shadow: ${props => props.theme.shadow.default};
  :focus {
    border: 2px solid ${props => props.theme.colors.purple};
  }
`

const FormLabel = styled.label`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.gray1};
`

const quoteTextPlaceholder =
  'Wow, du har sykt myke hender! Vanligvis når en jente gir meg en håndjob, sier jeg du kan jo suge meg i stedet, men de hendene'

const quoteContextPlaceholder = ' Fulle Elias som blir leid til do'
export const CreateQuote: React.VFC = () => {
  const [text, setText] = useState('')
  const [context, setContext] = useState('')
  const history = useHistory()
  const [tagged, setTagged] = useState<string[]>([])
  const [createQuote] = useMutation<CreateQuoteReturns, CreateQuoteVariables>(
    CREATE_QUOTE,
    {
      refetchQueries: ['PendingQuotes', 'SidebarQuery'],
      awaitRefetchQueries: true,
    }
  )

  const handleCreateQuote = () => {
    if (text === '') {
      toast.error('Sitatet må ha noe innhold')
      return
    }
    if (tagged.length === 0) {
      toast.error('Noen må bli tagget i sitatet')
      return
    }

    toast
      .promise(
        createQuote({
          variables: {
            input: {
              text: text,
              context: context,
              tagged: tagged,
              createdAt: formatISO(new Date()),
            },
          },
        }),
        {
          loading: 'Sender inn sitat...',
          success: 'Sitat sendt inn',
          error: 'Noe gikk galt',
        }
      )
      .then(() => history.push('/quotes'))
  }
  return (
    <Wrapper>
      <Title>Send inn sitat</Title>
      <FormContainer>
        <FormLabel>Innhold</FormLabel>
        <QuoteTextArea
          value={text}
          onChange={evt => setText(evt.target.value)}
          placeholder={quoteTextPlaceholder}
        />

        <FormLabel>Kontekst</FormLabel>
        <QuoteTextArea
          value={context}
          onChange={evt => setContext(evt.target.value)}
          placeholder={quoteContextPlaceholder}
        />
        <FormLabel>Taggede</FormLabel>
        <UserMultiSelect fullwidth setUsersCallback={setTagged} />
        <Button onClick={handleCreateQuote}>Send inn</Button>
      </FormContainer>
    </Wrapper>
  )
}
