import {
  Card,
  Group,
  SimpleGrid,
  Stack,
  ThemeIcon,
  Title,
  Transition,
  createStyles,
  Text,
  useMantineTheme,
  Affix,
  Button,
  Container,
} from '@mantine/core'
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconMoneybag,
  IconTriangle,
  IconTriangleFilled,
  IconTriangleInverted,
  IconTriangleInvertedFilled,
} from '@tabler/icons-react'
import { SociStockProduct } from '../components/SociStockProduct'
import { StockMarketProductsReturns } from '../types.graphql'
import { useQuery } from '@apollo/client'
import { STOCK_MARKET_PRODUCTS_QUERY } from '../queries'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface SociNomicsProps {}

export const SociNomics: React.FC<SociNomicsProps> = () => {
  const [stocksLength, setStocksLength] = useState(0)
  const [fullScreen, setFullScreen] = useState(false)
  const { classes, cx } = useStyles({ stocksLength, fullScreen })
  const theme = useMantineTheme()

  const { data, loading, error } = useQuery<StockMarketProductsReturns>(
    STOCK_MARKET_PRODUCTS_QUERY,
    {
      fetchPolicy: 'network-only',
      pollInterval: 5000,
    }
  )

  if (error) return <FullPageError error={error} />

  if (loading || !data) return <FullContentLoader />

  const stocks = data.stockMarketProducts

  if (stocks.length !== stocksLength) {
    setStocksLength(stocks.length)
  }

  return (
    <div className={fullScreen ? classes.root : classes.windowed}>
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
          Time since last crack:{' '}
        </Title>
      </Container>
      <div className={classes.scrollingContainer}>
        <div className={classes.scrollingInner}>
          {stocks.map((stock, index) => (
            <SociStockProduct stock={stock} key={index} />
          ))}
        </div>
      </div>
      <SimpleGrid my={'lg'} cols={2}>
        {stocks.map((stock, index) => (
          <SociStockProduct stock={stock} key={index} />
        ))}
      </SimpleGrid>
      <Affix
        style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 9001 }}
      >
        <Button variant="subtle" onClick={() => setFullScreen(!fullScreen)}>
          <IconChevronDown />
        </Button>
      </Affix>
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
