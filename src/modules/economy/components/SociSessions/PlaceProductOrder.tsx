import { Button, Checkbox, Group, NumberInput, Paper } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { PermissionGate } from 'components/PermissionGate'
import { UserSelect } from 'components/Select'
import { useProductOrderMutations } from 'modules/economy/mutations.hooks'
import { SOCI_SESSION_QUERY } from 'modules/economy/queries'
import { ME_QUERY } from 'modules/users/queries'
import { useState } from 'react'
import { PERMISSIONS } from 'util/permissions'
import { ProductSelect } from '../ProductSelect'

interface PlaceProductOrderProps {
  sociSessionId: string
}

export const PlaceProductOrder: React.FC<PlaceProductOrderProps> = ({
  sociSessionId,
}) => {
  const [userId, setUserId] = useState('')
  const [overcharge, setOvercharge] = useState(false)
  const [productId, setProductId] = useState('')
  const [orderSize, setOrderSize] = useState(1)

  const { placeProductOrder } = useProductOrderMutations()

  const handlePlaceProductOrder = () => {
    if (userId === '' || productId === '') return

    placeProductOrder({
      variables: {
        userId,
        productId,
        orderSize,
        sociSessionId,
        overcharge,
      },
      refetchQueries: [SOCI_SESSION_QUERY, ME_QUERY],
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
      onCompleted() {
        showNotification({
          title: 'Sukess',
          message: 'Ordren ble lagt til',
        })
        setOrderSize(1)
      },
    })
  }
  return (
    <Paper p="md">
      <Group spacing="lg">
        <UserSelect setUserCallback={setUserId} />
        <PermissionGate permissions={PERMISSIONS.economy.canOvercharge}>
          <Checkbox
            label="Sett i minus"
            checked={overcharge}
            onChange={evt => evt && setOvercharge(evt.target.checked)}
          />
        </PermissionGate>
        <ProductSelect value={productId} onChangeCallback={setProductId} />
        <NumberInput
          placeholder="Antall"
          value={orderSize}
          onChange={val => val && setOrderSize(val)}
        />
        <Button color="samfundet-red" onClick={handlePlaceProductOrder}>
          Legg til
        </Button>
      </Group>
    </Paper>
  )
}
