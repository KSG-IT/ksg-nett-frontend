import { useMutation } from '@apollo/client'
import { Badge, Button, Card, Group, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React from 'react'
import { CREATE_GHOST_ORDER_MUTATION } from '../mutations'
import { STOCK_MARKET_PRODUCTS_QUERY } from '../queries'
import {
  IncrementGhostOrderReturns,
  IncrementGhostOrderVariables,
  StockMarketProductNode,
} from '../types.graphql'

interface StockMarketProductProps {
  stock: StockMarketProductNode
}

const SociStockProductControlCard: React.FC<StockMarketProductProps> = ({
  stock,
}) => {
  const [createGhostOrder] = useMutation<
    IncrementGhostOrderReturns,
    IncrementGhostOrderVariables
  >(CREATE_GHOST_ORDER_MUTATION, {
    refetchQueries: [
      {
        query: STOCK_MARKET_PRODUCTS_QUERY,
      },
    ],
  })

  async function handleIncrementGhostOrder() {
    await createGhostOrder({
      variables: {
        productId: stock.id,
      },
      onError({ message }) {
        showNotification({
          title: 'Error',
          message,
          color: 'red',
        })
      },
    })
  }

  return (
    <Card withBorder radius={'md'} style={{ minWidth: 250 }}>
      <Title order={3}>{stock.name}</Title>
      <Text>${stock.price}</Text>
      <Badge color={stock.percentageChange > 0 ? 'green' : 'red'}>
        {stock.percentageChange > 0
          ? `+${stock.percentageChange}%`
          : `${stock.percentageChange}%`}
      </Badge>
      <Group position="right">
        <Button onClick={handleIncrementGhostOrder}>Kjøp</Button>
      </Group>
    </Card>
  )
}

export default SociStockProductControlCard
