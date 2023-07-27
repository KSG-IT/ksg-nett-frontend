import { useQuery } from '@apollo/client'
import { Card, Group, List, Stack, Title, UnstyledButton } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useSociOrderSessionMutations } from 'modules/economy/mutations.hooks'
import { MY_SESSION_PRODUCT_ORDERS_QUERY } from 'modules/economy/queries'
import { MySessionProductOrdersReturns } from 'modules/economy/types.graphql'

export const MyFoodOrders: React.FC = ({}) => {
  const { data } = useQuery<MySessionProductOrdersReturns>(
    MY_SESSION_PRODUCT_ORDERS_QUERY
  )

  const { deleteSociOrderSessionFoodOrder } = useSociOrderSessionMutations()

  const orders = data?.mySessionProductOrders ?? []

  function handleDeleteOrder(id: string) {
    deleteSociOrderSessionFoodOrder({
      variables: {
        orderId: id,
      },
      refetchQueries: [MY_SESSION_PRODUCT_ORDERS_QUERY],
    })
  }

  return (
    <Stack>
      <Title order={3}>Min bestilling</Title>

      {orders.length === 0 && <div>Du har ikke bestilt noe</div>}
      <Card>
        <List>
          {orders.map(order => (
            <List.Item key={order.id}>
              <Group>
                {order.product.name} - {order.product.price}kr
                <UnstyledButton onClick={() => handleDeleteOrder(order.id)}>
                  <IconTrash />
                </UnstyledButton>
              </Group>
            </List.Item>
          ))}
        </List>
      </Card>
    </Stack>
  )
}
