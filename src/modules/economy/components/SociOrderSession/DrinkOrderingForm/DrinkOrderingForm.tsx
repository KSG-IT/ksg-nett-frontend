import { useQuery } from '@apollo/client'
import { Button, Group, Select } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useSociOrderSessionMutations } from 'modules/economy/mutations.hooks'
import {
  ALL_SOCI_ORDERR_SESSION_DRINK_ORDERS_QUERY,
  DEFAULT_SOCI_ORDER_SESSION_DRINK_PRODUCTS,
} from 'modules/economy/queries'
import { SociProductNode } from 'modules/economy/types.graphql'
import { ME_QUERY } from 'modules/users/queries'
import { useState } from 'react'

export const DrinkOrderingForm: React.FC = ({}) => {
  const [selectedProduct, setSelectedProduct] = useState('')

  const { data } = useQuery(DEFAULT_SOCI_ORDER_SESSION_DRINK_PRODUCTS)
  const { placeSociOrderSessionOrder } = useSociOrderSessionMutations()

  const products = data?.defaultSociOrderSessionDrinkProducts ?? []

  const options = products.map((product: SociProductNode) => ({
    label: product.name + ' - ' + product.price + 'kr',
    value: product.id,
  }))

  function handlePlaceOrder() {
    if (!selectedProduct) return

    placeSociOrderSessionOrder({
      variables: {
        productId: selectedProduct,
        amount: 1,
      },
      refetchQueries: [ALL_SOCI_ORDERR_SESSION_DRINK_ORDERS_QUERY, ME_QUERY],
      onCompleted() {
        showNotification({
          title: 'Bestilling lagt inn',
          message: 'Varen er krysset!',
        })
        setSelectedProduct('')
      },
      onError(data) {
        showNotification({
          title: 'Noe gikk galt',
          message: data.message,
        })
      },
    })
  }
  return (
    <form>
      <div>Kryss noe å drikke</div>
      <Group align="flex-end">
        <Select
          label="Velg produkt"
          placeholder="Velg produkt"
          data={options}
          value={selectedProduct}
          onChange={val => val && setSelectedProduct(val)}
        />
        <Button onClick={handlePlaceOrder}>Kryss</Button>
      </Group>
    </form>
  )
}
