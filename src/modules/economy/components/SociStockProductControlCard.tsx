// StockMarketProduct.tsx

import React from 'react'
import { Card, Title, Text, Badge, Button, Group } from '@mantine/core'
import {
  IncrementGhostOrderReturns,
  IncrementGhostOrderVariables,
  StockMarketProductNode,
} from '../types.graphql'
import { useMutation } from '@apollo/client'
import { CREATE_GHOST_ORDER_MUTATION } from '../mutations'
import { STOCK_MARKET_PRODUCTS_QUERY } from '../queries'

interface StockMarketProductProps {
  stock: StockMarketProductNode
}

const SociStockProductControlCard: React.FC<StockMarketProductProps> = ({
  stock,
}) => {
  // create a function to mutate the stock market product
  const [mutate, { data, loading, error }] = useMutation<
    IncrementGhostOrderReturns,
    IncrementGhostOrderVariables
  >(CREATE_GHOST_ORDER_MUTATION, {
    refetchQueries: [
      {
        query: STOCK_MARKET_PRODUCTS_QUERY,
      },
    ],
  })

  // create a function to increment the ghost order
  const incrementGhostOrder = async () => {
    await mutate({
      variables: {
        productId: stock.id,
      },
    }).then(res => {
      console.log(res)
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
        <Button onClick={incrementGhostOrder}>Kjøp</Button>
      </Group>
    </Card>
  )
}

export default SociStockProductControlCard
