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
  Title,
  Text,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { IconHash, IconQuote } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { UserMultiSelect } from 'components/Select'
import { formatISO } from 'date-fns'
import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'util/hooks'
import { CREATE_QUOTE } from '../mutations'
import { PNEDING_QUOTES_QUERY } from '../queries'
import { CreateQuoteReturns, CreateQuoteVariables } from '../types.graphql'
import { MessageBox } from 'components/MessageBox'

const quoteTextPlaceholder =
  'Wow, du har sykt myke hender! Vanligvis når en jente gir meg en håndjob, sier jeg du kan jo suge meg i stedet, men de hendene'

const quoteContextPlaceholder = ' Fulle Elias som blir leid til do'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Sitater', path: '/quotes' },
  { label: 'Legg til sitat', path: '' },
]
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

  function handleCreateQuote() {
    if (text === '') {
      showNotification({
        title: 'Mangler data',
        message: 'Mangler sitat',
      })
      return
    }
    if (tagged.length === 0) {
      showNotification({
        title: 'Mangler data',
        message: 'Noen må tagges',
      })
      return
    }

    modals.openConfirmModal({
      title: 'Bekreft innsending av sitatet ditt',
      children: (
        <Text size={'sm'}>
          Er du sikker på at du vil sende inn sitatet? Husk at sitatet ikke skal
          være støtende eller krenkende for dem det gjelder.
        </Text>
      ),
      labels: {
        cancel: 'Angre',
        confirm: 'Bekreft',
      },
      onConfirm: () =>
        createQuote({
          variables: {
            input: {
              text: text,
              context: context,
              tagged: tagged,
              createdAt: formatISO(new Date()),
            },
          },
          refetchQueries: [PNEDING_QUOTES_QUERY],
          onCompleted() {
            showNotification({
              title: 'Suksess',
              message: 'Sitat sendt inn til godkjenning',
            })
            navigate('/quotes')
          },
          onError({ message }) {
            showNotification({
              title: 'Noe gikk galt',
              message,
            })
          },
        }),
      onCancel: () => null,
    })
  }

  return (
    <Container size={'sm'} p={mobileSize ? 0 : 'sm'}>
      <Breadcrumbs items={breadcrumbsItems} />
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
            <MessageBox type="info">
              Tenk deg om før du sender inn sitater om andre. Det er ikke
              sikkert de synes det er like morsomt som deg.
            </MessageBox>

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
            <Textarea
              value={context}
              label={'Kontekst'}
              minRows={mobileSize ? 4 : 1}
              variant={'filled'}
              size={mobileSize ? 'sm' : 'md'}
              icon={<IconHash />}
              onChange={evt => setContext(evt.target.value)}
              placeholder={quoteContextPlaceholder}
            />
            <UserMultiSelect users={tagged} setUsersCallback={setTagged} />
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
  select: {
    color: 'green',
  },
}))
