import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { CardTable } from 'components/CardTable'
import { MessageBox } from 'components/MessageBox'
import { BarTabOrderTypeValues } from 'modules/barTab/enums'
import {
  useBarTabMutations,
  useBarTabOrderMutations,
} from 'modules/barTab/mutations.hooks'
import { ACTIVE_BAR_TAB_QUERY } from 'modules/barTab/queries'
import { BarTabNode } from 'modules/barTab/types.graphql'
import { useMemo, useState } from 'react'
import { BarTabCustomerSelect } from '../BarTabCustomerSelect'
import { BarTabProductSelect } from '../BarTabProductSelect'
import { createStyles } from '@mantine/emotion'

interface ActiveBarTablControllerProps {
  barTab: BarTabNode
}

export const RegisterProductOrders: React.FC<ActiveBarTablControllerProps> = ({
  barTab,
}) => {
  const [customerId, setCusomerId] = useState('')
  const [name, setName] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [away, setAway] = useState(false)
  const [orderType, setOrderType] = useState(BarTabOrderTypeValues.LIST)
  const { classes } = useRegisterProductOrdersStyles()

  const uniqueListNames = useMemo(() => {
    const orderNames = barTab.orders.map(order => order.getNameDisplay)
    const uniqueNames = [...new Set(orderNames)]
    return uniqueNames.filter(
      name => name.toLocaleUpperCase() !== BarTabOrderTypeValues.BONG
    )
  }, [barTab.orders])

  const { lockBarTab } = useBarTabMutations()
  const { createBarTabOrder, deleteBarTabOrder } = useBarTabOrderMutations()

  function handleAddProductOrder() {
    if (customerId === '') {
      showNotification({
        title: 'Mangler gjeng',
        message: 'Du må velge en gjeng',
        color: 'red',
      })
      return
    }

    if (productId === '') {
      showNotification({
        title: 'Mangler vare',
        message: 'Du må velge en vare',
        color: 'red',
      })
      return
    }

    const input = {
      barTab: barTab.id,
      customer: customerId,
      product: productId,
      type: orderType,
      name: name,
      away: away,
      quantity,
    }

    if (orderType === BarTabOrderTypeValues.BONG) {
      input.name = ''
    }
    createBarTabOrder({
      variables: { input: { ...input } },
      refetchQueries: [ACTIVE_BAR_TAB_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Kryss lagret',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }

  function handleDeleteBarTabOrder(id: string) {
    deleteBarTabOrder({
      variables: { id: id },
      refetchQueries: [ACTIVE_BAR_TAB_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Kryss slettet',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }

  function handleLockBarTab() {
    lockBarTab({
      refetchQueries: [ACTIVE_BAR_TAB_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'BSF låst',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }

  const rows = barTab.orders.map(order => (
    <tr key={order.id}>
      <td>
        <Text>{order.getNameDisplay}</Text>
      </td>
      <td>
        <Text>{order.customer.name}</Text>
      </td>
      <td>
        <Text>{order.purchasedWhere}</Text>
      </td>
      <td>
        <Text>{order.product.name}</Text>
      </td>
      <td>
        <Text>{order.product.price},- NOK</Text>
      </td>
      <td>
        <Text>{order.quantity}</Text>
      </td>
      <td>
        <Text>{order.cost},- NOK</Text>
      </td>
      <td>
        <UnstyledButton onClick={() => handleDeleteBarTabOrder(order.id)}>
          <IconTrash />
        </UnstyledButton>
      </td>
    </tr>
  ))

  return (
    <Stack className={classes.wrapper}>
      <Group position="apart">
        <Group>
          <Button color="samfundet-red" onClick={handleLockBarTab}>
            Lås BSF
          </Button>
        </Group>
      </Group>

      <CardTable>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Gjeng</th>
            <th>Sted</th>
            <th>Vare</th>
            <th>Pris</th>
            <th>Antall</th>
            <th>Totalpris</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </CardTable>

      <Title order={3}>Registrer kryss</Title>
      <MessageBox type="info">
        Kryss borte er kryss vi har gjort hos andre gjenger. Fjern verdien for å
        registerere et kryss hos oss. Type bestemmer om det har blitt brukt
        krysseliste eller bong for dette krysset. Om du velger bong, vil navn
        ikke blir lagret
      </MessageBox>
      <Card className={classes.addOrderWrapper}>
        <Group mt="xs">
          <BarTabCustomerSelect
            customerId={customerId}
            label="Velg gjeng"
            onSelectCallback={setCusomerId}
          />
          <Autocomplete
            label="Navn"
            value={name}
            data={uniqueListNames}
            onChange={setName}
          />
          <Checkbox
            label="Krysset borte"
            checked={away}
            onChange={evt => setAway(evt.target.checked)}
          />
          <Select
            label="Type"
            value={orderType}
            onChange={(val: BarTabOrderTypeValues) => val && setOrderType(val)}
            data={[
              {
                value: BarTabOrderTypeValues.LIST,
                label: BarTabOrderTypeValues.LIST,
              },
              {
                value: BarTabOrderTypeValues.BONG,
                label: BarTabOrderTypeValues.BONG,
              },
            ]}
          />
          <BarTabProductSelect
            productId={productId}
            label="Velg vare"
            onSelectCallback={setProductId}
          />
          <NumberInput
            label="Antall"
            value={quantity}
            min={1}
            max={100}
            onChange={val => val && setQuantity(val)}
          />
        </Group>
      </Card>
      <Group>
        <Button color="samfundet-red" onClick={handleAddProductOrder}>
          Lagre kryss
        </Button>
      </Group>
    </Stack>
  )
}

const useRegisterProductOrdersStyles = createStyles(theme => ({
  wrapper: {},
  card: {
    overflowX: 'scroll',
  },
  addOrderWrapper: {
    overflow: 'visible',
  },
}))
