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
import { IconSearch } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { ME_QUERY } from 'modules/users'
import { useState } from 'react'
import { useStore } from 'store'
import styled from 'styled-components'
import { MEDIA_URL } from 'util/env'
import { useDebounce } from 'util/hooks'
import { numberWithSpaces } from 'util/parsing'
import {
  AllDepositsQuery,
  AllDepositsVariables,
  ALL_DEPOSITS,
  DepositNode,
  PATCH_DEPOSIT,
} from '.'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  overflow-y: scroll;

  ${props => props.theme.media.mobile} {
    display: flex;
    flex-direction: column;
  }
`

export const Deposits: React.VFC = () => {
  const [unverifiedOnly, setUnverifiedOnly] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const [patchDeposit] = useMutation(PATCH_DEPOSIT, {
    refetchQueries: [{ query: ALL_DEPOSITS }, { query: ME_QUERY }],
  })
  const user = useStore(state => state.user)!

  const handlePatchDeposit = (deposit: DepositNode) => {
    const { id, signedOffBy } = deposit

    if (!signedOffBy) {
      // not approved yet, approving with the logged in user
      patchDeposit({
        variables: {
          id: id,
          input: {
            signedOffBy: user.id,
          },
        },
      })
    } else {
      //approved so we are unapproving it
      patchDeposit({
        variables: {
          id: id,
          input: {
            signedOffBy: null,
            signedOffTime: null,
          },
        },
      })
    }
  }

  const { data, loading, error } = useQuery<
    AllDepositsQuery,
    AllDepositsVariables
  >(ALL_DEPOSITS, {
    variables: {
      q: debouncedQuery,
      unverifiedOnly: unverifiedOnly,
    },
  })

  if (error) return <FullPageError />

  // Loading state should be moved into table
  if (loading || !data) return <FullContentLoader />

  const deposits = data?.allDeposits.edges.map(edge => edge.node) ?? []

  const rows = deposits.map(deposit => (
    <tr>
      <td>{format(new Date(deposit.createdAt), 'MM.dd')}</td>
      <td>{deposit.account.user.fullName}</td>
      <td>{numberWithSpaces(deposit.amount)},- NOK</td>
      <td>
        {deposit.receipt ? (
          <a
            href={`${MEDIA_URL}${deposit.receipt}`}
            target="_blank"
            rel="noreferrer"
          >
            Kvittering
          </a>
        ) : (
          'Ingen kvittering'
        )}
      </td>
      <td>
        {deposit.approved ? (
          <Button
            onClick={() => {
              handlePatchDeposit(deposit)
            }}
          >
            Godkjenn
          </Button>
        ) : (
          <Button
            color="red"
            onClick={() => {
              handlePatchDeposit(deposit)
            }}
          >
            Underkjenn
          </Button>
        )}
      </td>
    </tr>
  ))

  return (
    <Wrapper>
      <Group position="apart">
        <Title>Innskudd</Title>
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
      <Paper p="md">
        <Table>
          <thead>
            <td>Dato</td>
            <td>Navn</td>
            <td>Beløp</td>
            <td>Kvittering</td>
            <td></td>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Wrapper>
  )
}
