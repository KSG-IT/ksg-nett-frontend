import { useMutation } from '@apollo/client'
import {
  ActionIcon,
  Card,
  Title,
  Text,
  createStyles,
  Group,
  TextInput,
} from '@mantine/core'
import { IconEdit } from '@tabler/icons'
import { useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { numberWithSpaces } from 'util/parsing'
import { PATCH_SOCI_BANK_ACCOUNT } from '../mutations'
import {
  PatchSociBankAccountReturns,
  PatchSociBankAccountVariables,
  SociBankAccountNode,
} from '../types.graphql'
const Label = styled.label`
  margin-right: 10px;
`

const Balance = styled.span`
  font-size: 18px;
  font-weight: 600;
`

const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`

const CardInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  input {
    margin-right: 5px;
  }
`

interface AccountCardProps {
  account: Pick<SociBankAccountNode, 'balance' | 'cardUuid' | 'id'>
}

export const AccountCard: React.VFC<AccountCardProps> = ({ account }) => {
  const { classes } = useStyles()
  const [cardUuid, setCardUuid] = useState(account.cardUuid)
  const [editable, setEditable] = useState(false)

  const [changeCardUuid] = useMutation<
    PatchSociBankAccountReturns,
    PatchSociBankAccountVariables
  >(PATCH_SOCI_BANK_ACCOUNT, {
    variables: { id: account.id, input: { cardUuid: cardUuid } },
    refetchQueries: ['Me', 'MyBankAccount'],
    onCompleted() {
      toast.success('Kortnummer oppdatert!')
    },
  })

  const toggleEditable = () => {
    if (editable) {
      // We are going from editable to non-editable meaning we want to save the change
      handleChangeCardUuid()
    }
    setEditable(!editable)
  }

  const handleChangeCardUuid = () => {
    if (cardUuid === account.cardUuid) return

    changeCardUuid()
  }

  return (
    <Card className={classes.card}>
      <Card.Section p={'md'}>
        <Title
          align="center"
          order={6}
          transform={'uppercase'}
          color={'gray.3'}
        >
          Saldo i KR
        </Title>
        <Title align="center" weight={'lighter'} color={'gray.0'}>
          {numberWithSpaces(account.balance)}
        </Title>
      </Card.Section>
      <Card.Section m="xs">
        <Text align="center">Kortnummer</Text>
        <Group position="center">
          <TextInput
            value={cardUuid}
            disabled={!editable}
            onChange={evt => setCardUuid(evt.target.value)}
            onBlur={toggleEditable}
          />
          <ActionIcon onClick={toggleEditable}>
            <IconEdit stroke={1.4} color="white" />
          </ActionIcon>
        </Group>
      </Card.Section>
    </Card>
  )
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors['samfundet-red'][5],
    color: theme.white,
  },
}))
