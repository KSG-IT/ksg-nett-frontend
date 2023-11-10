import { useMutation, useQuery } from '@apollo/client'
import { Button, Container, SimpleGrid, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import SociStockProductControlCard from '../components/SociStockProductControlCard'
import { STOCK_MARKET_CRASH_MUTATION } from '../mutations'
import { STOCK_MARKET_PRODUCTS_QUERY } from '../queries'
import {
  StockMarketCrashMutationReturns,
  StockMarketCrashMutationVariables,
  StockMarketProductsReturns,
} from '../types.graphql'

const SocinomicsControlPanel: React.FC = () => {
  // query for stock market products
  const { data, loading, error } = useQuery<StockMarketProductsReturns>(
    STOCK_MARKET_PRODUCTS_QUERY,
    {
      pollInterval: 5000,
    }
  )
  const [crashStockMarket] = useMutation<
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
    if (!check) return

    crashStockMarket({
      onCompleted() {
        showNotification({
          title: 'Stock market crashed',
          message: 'All stocks have been reset to their original price',
        })
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
