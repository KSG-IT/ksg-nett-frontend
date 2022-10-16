import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Checkbox,
  Group,
  Paper,
  Table,
  TextInput,
  Title,
} from '@mantine/core'
import {
  IconFileSymlink,
  IconLoader,
  IconLoader2,
  IconRefresh,
  IconSearch,
} from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { ME_QUERY } from 'modules/users/queries'
import { useState } from 'react'
import { useStore } from 'store'
import styled from 'styled-components'
import { DEFAULT_PAGINATION_SIZE } from 'util/consts'
import { format } from 'util/date-fns'
import { MEDIA_URL } from 'util/env'
import { useDebounce } from 'util/hooks'
import { numberWithSpaces } from 'util/parsing'
import { DepositsTable } from '../components/Deposits'
import { PATCH_DEPOSIT } from '../mutations'
import { ALL_DEPOSITS } from '../queries'
import {
  AllDepositsQuery,
  AllDepositsVariables,
  DepositNode,
} from '../types.graphql'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  overflow-y: scroll;

  ${props => props.theme.media.mobile} {
    display: flex;
    flex-direction: column;
  }
`

export const Deposits: React.FC = () => {
  const [unverifiedOnly, setUnverifiedOnly] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)

  const { data, loading, error, refetch } = useQuery<
    AllDepositsQuery,
    AllDepositsVariables
  >(ALL_DEPOSITS, {
    variables: {
      q: debouncedQuery,
      unverifiedOnly: unverifiedOnly,
      first: DEFAULT_PAGINATION_SIZE,
    },
  })

  if (error) return <FullPageError />

  const deposits = data?.allDeposits.edges.map(edge => edge.node) ?? []

  return (
    <Wrapper>
      <Group position="apart">
        <Title>Innskudd</Title>
        <Button
          color="samfundet-red"
          leftIcon={<IconRefresh />}
          onClick={() => refetch()}
        >
          Oppdater
        </Button>
      </Group>
      <Paper p="md" mb="sm" mt="sm">
        <Group align="center">
          <TextInput
            value={query}
            onChange={evt => setQuery(evt.target.value)}
            icon={<IconSearch />}
            placeholder="Søk etter bruker..."
          />
          <Checkbox
            label="Bare ikke godkjente"
            checked={unverifiedOnly}
            onChange={() => setUnverifiedOnly(!unverifiedOnly)}
          />
        </Group>
      </Paper>
      <DepositsTable deposits={deposits} queryLoading={loading} />
    </Wrapper>
  )
}
