import { useMutation } from '@apollo/client'
import {
  ActionIcon,
  Card,
  Title,
  Text,
  createStyles,
  Group,
  TextInput,
  CardProps,
  Badge,
  Button,
  Container,
} from '@mantine/core'
import { IconCash, IconCreditCard, IconEdit, IconPlus } from '@tabler/icons'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { numberWithSpaces } from 'util/parsing'
import { PATCH_SOCI_BANK_ACCOUNT } from '../mutations'
import {
  PatchSociBankAccountReturns,
  PatchSociBankAccountVariables,
  SociBankAccountNode,
} from '../types.graphql'
import { Link } from 'react-router-dom'

interface AccountCardProps extends Omit<CardProps, 'children'> {
  account: Pick<SociBankAccountNode, 'balance' | 'cardUuid' | 'id'>
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  className,
}) => {
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
    <Card withBorder className={classes.balanceCard}>
      <Group position={'right'}>
        <Title
          order={4}
          variant={'gradient'}
          gradient={{ from: 'samfundet-red.0', to: 'samfundet-red.2', deg: 30 }}
        >
          Socibanken
        </Title>
      </Group>
      <Container px={'md'} py={'sm'}>
        <Group position={'apart'}>
          <Card.Section p={'lg'}>
            <Badge color={'samfundet-red'} size={'sm'}>
              Saldo
            </Badge>
            <Title align="center" weight={'lighter'} color={'gray.0'}>
              {numberWithSpaces(account.balance)} kr
            </Title>
          </Card.Section>
          <Button
            component={Link}
            to={'/economy/deposits/create'}
            variant={'light'}
            color={'samfundet-red'}
          >
            <IconCash />
            <IconPlus />
          </Button>
        </Group>
        <Group position={'center'}>
          <Card.Section>
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
        </Group>
      </Container>
    </Card>
  )
}

const useStyles = createStyles(theme => ({
  cardWithBorder: {
    borderTop: `5px solid ${theme.colors.brand}`,
  },
  balanceCard: {
    backgroundImage: theme.fn.gradient({
      from: 'samfundet-red.7',
      to: 'samfundet-red.4',
      deg: 360,
    }),
    color: theme.white,
    maxWidth: 420,
    maxHeight: 300,
    borderRadius: theme.radius.lg,
  },
}))
