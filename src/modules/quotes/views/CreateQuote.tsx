import { useMutation } from '@apollo/client'
import {
  Button,
  Card,
  Container,
  createStyles,
  Group,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { IconHash, IconQuote } from '@tabler/icons'
import { UserMultiSelect } from 'components/Select'
import { formatISO } from 'date-fns'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'util/hooks'
import { CreateQuoteReturns, CreateQuoteVariables } from '../types.graphql'
import { CREATE_QUOTE } from '../mutations'

const quoteTextPlaceholder =
  'Wow, du har sykt myke hender! Vanligvis når en jente gir meg en håndjob, sier jeg du kan jo suge meg i stedet, men de hendene'

const quoteContextPlaceholder = ' Fulle Elias som blir leid til do'
export const CreateQuote: React.FC = () => {
  const { classes } = useStyles()
  const mobileSize = useMediaQuery('(max-width: 600px)')
  const [text, setText] = useState('')
  const [context, setContext] = useState('')
  const navigate = useNavigate()
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
      .then(() => navigate('/quotes'))
  }
  return (
    <Container size={'sm'} p={mobileSize ? 0 : 'sm'}>
      <Title
        my={'lg'}
        transform="uppercase"
        className={classes.title}
        order={3}
      >
        Send inn sitat
      </Title>
      <Card radius={'md'} withBorder className={classes.card}>
        <Stack spacing={'lg'} p={mobileSize ? 0 : 'xl'}>
          <SimpleGrid cols={1} spacing={'md'}>
            <Textarea
              value={text}
              variant={'filled'}
              label={'Sitat'}
              minRows={mobileSize ? 4 : 2}
              size={mobileSize ? 'sm' : 'md'}
              icon={<IconQuote />}
              onChange={evt => setText(evt.target.value)}
              placeholder={quoteTextPlaceholder}
            />
            <TextInput
              value={context}
              label={'Kontekst'}
              variant={'filled'}
              size={mobileSize ? 'xs' : 'sm'}
              icon={<IconHash />}
              onChange={evt => setContext(evt.target.value)}
              placeholder={quoteContextPlaceholder}
            />
            <UserMultiSelect
              size={'sm'}
              label={'Tagg'}
              placeholder={'Tagget: Elias'}
              fullwidth
              setUsersCallback={setTagged}
            />
          </SimpleGrid>
          <Group position="apart">
            <Button
              variant="outline"
              color={'samfundet-red'}
              component={Link}
              to="/quotes"
            >
              Avbryt
            </Button>
            <Button
              mt={'md'}
              color={'samfundet-red'}
              onClick={handleCreateQuote}
            >
              Send inn
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  )
}

const useStyles = createStyles(theme => ({
  title: {
    color: theme.colors.gray[6],
    fontWeight: 'bold',
  },
  card: {
    borderTop: `5px solid ${theme.colors.brand}`,
  },
}))
