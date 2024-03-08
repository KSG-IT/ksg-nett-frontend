import { useQuery } from '@apollo/client'
import {
  Affix,
  Box,
  Button,
  Container,
  SimpleGrid,
  Title,
  createStyles,
  keyframes,
} from '@mantine/core'
import { IconMaximize } from '@tabler/icons-react'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useEffect, useState } from 'react'
import { useIsMobile } from 'util/hooks'
import { SociStockProduct } from '../components/SociStockProduct'
import {
  STOCK_MARKET_PRODUCTS_QUERY,
  STOCK_PRICE_HISTORY_QUERY,
} from '../queries'
import {
  StockMarketProductNode,
  StockMarketProductsReturns,
  StockPriceHistoryNode,
  StockPriceHistoryReturns,
} from '../types.graphql'

const Socinomics: React.FC = () => {
  const [stocksLength, setStocksLength] = useState(0)
  const [fullScreen, setFullScreen] = useState(false)
  const isMobile = useIsMobile()
  const [marketCrashCountdown, setMarketCrashCountdown] = useState<
    null | number
  >(null)
  const { classes } = useStyles({ stocksLength, fullScreen })

  const { data, loading, error } = useQuery<StockMarketProductsReturns>(
    STOCK_MARKET_PRODUCTS_QUERY,
    {
      fetchPolicy: 'network-only',
      pollInterval: 10_000,
    }
  )

  const {
    data: priceHistoryData,
    loading: priceHistoryLoading,
    error: priceHistoryError,
  } = useQuery<StockPriceHistoryReturns>(STOCK_PRICE_HISTORY_QUERY, {
    fetchPolicy: 'network-only',
    pollInterval: 10_000,
  })

  useEffect(() => {
    if (!data) return

    if (!data.lastMarketCrash) return

    if (!data.lastMarketCrash.timestamp) return

    const interval = setInterval(() => {
      setMarketCrashCountdown(
        Math.floor(
          (new Date().getTime() -
            new Date(data.lastMarketCrash.timestamp).getTime()) /
            1000
        )
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [data])

  if (error || priceHistoryError) return <FullPageError error={error} />

  if (loading || priceHistoryLoading || !data || !priceHistoryData)
    return <FullContentLoader />

  const { stockMarketProducts: stocks, lastMarketCrash } = data

  const { stockPriceHistory } = priceHistoryData

  // find matching stock price history to the stock, and append it to the stock object
  stocks.forEach((stock: StockMarketProductNode) => {
    const matchingPriceHistory = stockPriceHistory.find(
      (priceHistory: StockPriceHistoryNode) =>
        priceHistory.productName === stock.name
    )

    if (matchingPriceHistory) {
      stock.marketHistory = matchingPriceHistory.dataPoints
    }
  })

  console.log(stocks)
  console.log('Stock price history: ', stockPriceHistory)

  // display if timestamp is not null and is less than 10 minutes ago
  const displayMarketCrashBanner =
    marketCrashCountdown && marketCrashCountdown < 60 * 10

  if (stocks.length !== stocksLength) {
    setStocksLength(stocks.length)
  }

  return (
    <div className={fullScreen ? classes.root : classes.windowed}>
      {displayMarketCrashBanner && (
        <Container
          className={classes.crackContainer}
          py={'sm'}
          mb={'sm'}
          fluid
          bg={'samfundet-red'}
        >
          <Title
            className={classes.scrollingInner}
            align="center"
            style={{
              color: 'white',
              textShadow: '1px 1px 2px black',
              animationDuration: '11s',
            }}
            order={1}
          >
            Børskrakk: {marketCrashCountdown} sekunder siden
          </Title>
        </Container>
      )}

      <Box className={classes.scrollingContainer}>
        <div className={classes.scrollingInner}>
          {stocks.map((stock, index) => (
            <SociStockProduct stock={stock} key={index} />
          ))}
        </div>
      </Box>

      <SimpleGrid my={'lg'} cols={isMobile ? 1 : 2}>
        {stocks.map((stock, index) => (
          <SociStockProduct showMarketHistory stock={stock} key={index} />
        ))}
      </SimpleGrid>
      {!isMobile && (
        <Affix
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 9001,
            backgroundColor: 'darkgrey',
          }}
        >
          <Button variant="subtle" onClick={() => setFullScreen(!fullScreen)}>
            <IconMaximize />
          </Button>
        </Affix>
      )}
    </div>
  )
}

const blink = keyframes({
  '0%': { borderColor: 'black' },
  '50%': { borderColor: 'red' },
  '100%': { borderColor: 'black' },
})

const border = keyframes({
  '33%': { borderColor: 'lightblue', borderRightColor: 'lime' },
  '66%': { borderColor: 'lightblue', borderBottomColor: 'lime' },
  '90%': { borderColor: 'lightblue', borderLeftColor: 'lime' },
  '100%': { borderColor: 'lightblue', borderTopColor: 'lime' },
})

const useStyles = createStyles(
  (theme, variables: { stocksLength: number; fullScreen: boolean }) => ({
    windowed: {
      backgroundColor: '#111',
      height: '100%',
      overflow: 'hidden',
      padding: theme.spacing.md,
    },
    root: {
      position: 'absolute',
      backgroundColor: '#111',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: variables.fullScreen ? 9000 : 0,
      color: 'white',
      padding: theme.spacing.md,
      overflow: 'hidden',
    },
    scrollingContainer: {
      border: '4px solid silver',
      borderTopColor: 'lime',
      overflow: 'hidden',
      animation: `${border} 3s ease-out infinite`,
    },
    crackContainer: {
      border: '4px solid silver',
      overflow: 'hidden',
      animation: `${blink} 2s ease-in-out infinite alternate`,
    },

    scrollingInner: {
      paddingBlock: theme.spacing.md,
      display: 'flex',
      gap: theme.spacing.md,
      animationName: 'scroll',
      animationDuration: '10s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',

      '@keyframes scroll': {
        from: {
          transform: 'translateX(100%)', // Start position off the screen to the right
        },
        to: {
          transform: `translateX(${-30 * variables.stocksLength}%)`, // End position off the screen to the left
        },
      },
    },
  })
)

export default Socinomics
