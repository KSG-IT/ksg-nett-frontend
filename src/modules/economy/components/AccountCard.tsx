import { useMutation } from '@apollo/client'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CardProps,
  Container,
  createStyles,
  Group,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconCash, IconCheck, IconEdit, IconPlus } from '@tabler/icons-react'
import React, { useState } from 'react'
import { numberWithSpaces } from 'util/parsing'
import { PATCH_SOCI_BANK_ACCOUNT } from '../mutations'
import {
  PatchSociBankAccountReturns,
  PatchSociBankAccountVariables,
  SociBankAccountNode,
} from '../types.graphql'
import { Link } from 'react-router-dom'
import { showNotification } from '@mantine/notifications'
import { useMe } from '../../../util/hooks'

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
  const user = useMe()

  const [changeCardUuid] = useMutation<
    PatchSociBankAccountReturns,
    PatchSociBankAccountVariables
  >(PATCH_SOCI_BANK_ACCOUNT, {
    variables: { id: account.id, input: { cardUuid: cardUuid } },
    refetchQueries: ['Me', 'MyBankAccount'],
    onCompleted() {
      showNotification({
        title: 'Kortnummeret ble oppdatert',
        message: 'Kortnummeret ble oppdatert',
        color: 'teal',
        icon: <IconCheck />,
      })
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
      <Group position={'apart'}>
        <Title order={4} color={'samfundet-red.0'}>
          {user.getCleanFullName}
        </Title>
        <Title
          order={4}
          variant={'gradient'}
          gradient={{ from: 'samfundet-red.0', to: 'samfundet-red.2', deg: 30 }}
        >
          Socibanken
        </Title>
      </Group>
      <Container px={'md'} py={'sm'}>
        <Group p={'md'} position={'apart'}>
          <Card.Section>
            <div>
              <Badge>Saldo</Badge>
              <Text size={30} weight={'bold'} color={'samfundet-red.0'}>
                {numberWithSpaces(account.balance)} kr
              </Text>
            </div>
          </Card.Section>
          <Card.Section>
            <Text pb="xs" size={'sm'} color={'samfundet-red.1'}>
              Fyll på
            </Text>
            <Button
              component={Link}
              to={'/economy/deposits/create'}
              variant={'light'}
              color={'samfundet-red'}
            >
              <IconCash />
              <IconPlus />
            </Button>
          </Card.Section>
        </Group>
        <Group px="md">
          <Card.Section>
            <Text align="left" color={'samfundet-red.0'}>
              Kortnummer
            </Text>
            <Group position="center">
              <TextInput
                value={cardUuid}
                disabled={!editable}
                onChange={evt => setCardUuid(evt.target.value)}
                onBlur={toggleEditable}
              />
              <ActionIcon color={'samfundet-red.0'} onClick={toggleEditable}>
                <IconEdit stroke={1.4} />
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
