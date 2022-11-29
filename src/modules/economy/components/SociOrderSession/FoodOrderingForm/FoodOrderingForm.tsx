import { useQuery } from '@apollo/client'
import { Button, Group, Select } from '@mantine/core'
import { useSociOrderSessionMutations } from 'modules/economy/mutations.hooks'
import {
  DEFAULT_SOCI_ORDER_SESSION_FOOD_PRODUCTS,
  MY_SESSION_PRODUCT_ORDERS_QUERY,
} from 'modules/economy/queries'
import { useState } from 'react'
import { showNotification } from '@mantine/notifications'

export const FoodOrderingForm: React.FC = ({}) => {
  const [selectedProduct, setSelectedProduct] = useState('')

  const { data } = useQuery(DEFAULT_SOCI_ORDER_SESSION_FOOD_PRODUCTS)
  const { placeSociOrderSessionOrder } = useSociOrderSessionMutations()

  const products = data?.defaultSociOrderSessionFoodProducts ?? []

  const options = products.map((product: any) => ({
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
      refetchQueries: [MY_SESSION_PRODUCT_ORDERS_QUERY],
      onCompleted() {
        showNotification({
          title: 'Bestilling lagt inn',
          message: 'Bestillingen din er nå lagt inn i systemet',
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
      <div>Bestill noe mat</div>
      <Group align="flex-end">
        <Select
          label="Velg produkt"
          placeholder="Velg produkt"
          data={options}
          value={selectedProduct}
          onChange={val => val && setSelectedProduct(val)}
        />
        <Button onClick={handlePlaceOrder}>Bestill</Button>
      </Group>
    </form>
  )
}
