import { useQuery } from '@apollo/client'
import {
  Affix,
  Button,
  Container,
  SimpleGrid,
  Title,
  createStyles,
} from '@mantine/core'
import { IconMaximize } from '@tabler/icons-react'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useEffect, useState } from 'react'
import { useIsMobile } from 'util/hooks'
import { SociStockProduct } from '../components/SociStockProduct'
import { STOCK_MARKET_PRODUCTS_QUERY } from '../queries'
import { StockMarketProductsReturns } from '../types.graphql'

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
      pollInterval: 30_000,
    }
  )

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

  if (error) return <FullPageError error={error} />

  if (loading || !data) return <FullContentLoader />

  const { stockMarketProducts: stocks, lastMarketCrash } = data

  // display if timestamp is not null and is less than 10 minutes ago
  const displayMarketCrashBaner =
    marketCrashCountdown && marketCrashCountdown < 60 * 10

  if (stocks.length !== stocksLength) {
    setStocksLength(stocks.length)
  }

  return (
    <div className={fullScreen ? classes.root : classes.windowed}>
      {displayMarketCrashBaner && (
        <Container py={'sm'} mb={'sm'} fluid bg={'samfundet-red'}>
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
      <div className={classes.scrollingContainer}>
        <div className={classes.scrollingInner}>
          {stocks.map((stock, index) => (
            <SociStockProduct stock={stock} key={index} />
          ))}
        </div>
      </div>
      <SimpleGrid my={'lg'} cols={isMobile ? 1 : 2}>
        {stocks.map((stock, index) => (
          <SociStockProduct stock={stock} key={index} />
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
      border: '2px dotted yellow',
      overflow: 'hidden',
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
