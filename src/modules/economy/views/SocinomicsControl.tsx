// ControlPanel.tsx

import React from 'react'
import {
  StockMarketCrashMutationReturns,
  StockMarketCrashMutationVariables,
  StockMarketProductNode,
  StockMarketProductsReturns,
} from '../types.graphql'
import SociStockProductControlCard from '../components/SociStockProductControlCard'
import { Button, Container, SimpleGrid, Stack, Title } from '@mantine/core'
import { useMutation, useQuery } from '@apollo/client'
import { STOCK_MARKET_PRODUCTS_QUERY } from '../queries'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { ConfirmModal } from '@mantine/modals/lib/ConfirmModal'
import { STOCK_MARKET_CRASH_MUTATION } from '../mutations'

interface Product {
  name: string
  price: number
  change: number
}

const SocinomicsControlPanel: React.FC = () => {
  // query for stock market products
  const { data, loading, error } = useQuery<StockMarketProductsReturns>(
    STOCK_MARKET_PRODUCTS_QUERY,
    {
      pollInterval: 5000,
    }
  )
  const [mutate] = useMutation<
    StockMarketCrashMutationReturns,
    StockMarketCrashMutationVariables
  >(STOCK_MARKET_CRASH_MUTATION, {
    refetchQueries: [
      {
        query: STOCK_MARKET_PRODUCTS_QUERY,
      },
    ],
  })

  if (error || !data) return <FullPageError error={error} />

  if (loading) return <FullContentLoader />

  const handleStockMarketCrash = () => {
    const check = confirm(
      'Are you sure you want to crash the stock market? This will reset all stocks to their original price.'
    )
    if (check) {
      mutate().then(res => {
        console.log(res)
      })
    }
  }

  const products = data.stockMarketProducts
  return (
    <Container>
      <Title c="dimmed">Control Panel</Title>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'sm', cols: 1 },
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xl', cols: 3 },
        ]}
        spacing="md"
      >
        {products.map((product, index) => (
          <SociStockProductControlCard key={index} stock={product} />
        ))}
      </SimpleGrid>

      <Button onClick={handleStockMarketCrash}>Stock Market Crash</Button>
    </Container>
  )
}

export default SocinomicsControlPanel
