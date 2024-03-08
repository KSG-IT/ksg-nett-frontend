import { useQuery } from '@apollo/client'
import {
  Box,
  Card,
  Group,
  Stack,
  Title,
  Text,
  createStyles,
  useMantineTheme,
  keyframes,
  Center,
} from '@mantine/core'
import {
  IconMoneybag,
  IconTriangle,
  IconTriangleInverted,
} from '@tabler/icons-react'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useIsMobile } from 'util/hooks'
import { PRODUCT_ORDERS_WITHIN_TIME_FRAME, SOCI_PRODUCT } from '../queries'
import {
  ProductOrderNode,
  ProductOrdersReturns,
  SociProductReturns,
  StockMarketDataPoints,
  StockMarketProductNode,
} from '../types.graphql'
import { format } from 'date-fns'
import { useCallback, useEffect } from 'react'

interface SociStockProductProps {
  stock: StockMarketProductNode
  showMarketHistory?: boolean
}

export const SociStockProduct: React.FC<SociStockProductProps> = ({
  stock,
  showMarketHistory,
}) => {
  const { classes, cx } = useStyles()
  const theme = useMantineTheme()
  const isMobile = useIsMobile()

  const { data, loading, error } = useQuery<SociProductReturns>(SOCI_PRODUCT, {
    fetchPolicy: 'network-only',
    pollInterval: 20000,
    variables: {
      id: stock.id,
    },
  })

  if (error) return <FullPageError error={error} />
  if (loading || !data) return <FullContentLoader />

  const { sociProduct } = data

  return (
    <Card className={classes.stock}>
      <Group noWrap position="apart">
        <Group align="flex-end" noWrap>
          {sociProduct.icon ? (
            <Text size={48}>{sociProduct.icon}</Text>
          ) : (
            <IconMoneybag />
          )}
          <Stack spacing={0}>
            <Title className={classes.stockText} order={isMobile ? 4 : 1}>
              {stock.name}
            </Title>
            <Group noWrap spacing={0}>
              <Title
                className={cx(classes.stockText, {
                  [classes.stockTextPositive]: stock.percentageChange > 0,
                  [classes.stockTextNegative]: stock.percentageChange < 0,
                })}
                order={isMobile ? 4 : 1}
                mr="sm"
              >
                {stock.price}
              </Title>
              {stock.percentageChange >= 0 ? (
                <IconTriangle
                  color={theme.colors.green[4]}
                  fill={theme.colors.green[4]}
                  size={isMobile ? 12 : 24}
                  style={{ marginRight: '5px' }}
                />
              ) : (
                <IconTriangleInverted
                  color={theme.colors.red[4]}
                  fill={theme.colors.red[4]}
                  size={isMobile ? 12 : 24}
                  style={{ marginRight: '5px' }}
                />
              )}
              <Title
                className={cx(classes.stockText, {
                  [classes.stockTextPositive]: stock.percentageChange > 0,
                  [classes.stockTextNegative]: stock.percentageChange < 0,
                })}
                order={isMobile ? 4 : 2}
              >
                {stock.percentageChange}%
              </Title>
            </Group>
          </Stack>
        </Group>
        {showMarketHistory && (
          <Box>
            <Group spacing={2} noWrap align="flex-end" position="right">
              {stock.marketHistory?.map(
                (order: StockMarketDataPoints, index: number) => {
                  return (
                    <Box
                      className={classes.stockActivity}
                      sx={{
                        height: `${1.5 * order.price}px`,
                        maxHeight: '160px',
                        width: `300px / ${stock.marketHistory?.length}px`,
                        minWidth: '8px',
                        maxWidth: '300px',
                      }}
                    />
                  )
                }
              )}
            </Group>
          </Box>
        )}
      </Group>
    </Card>
  )
}

const borderAnimation = keyframes({
  // light up the bars in the graph with gradient colors

  '0%': { borderColor: 'black' },
  '50%': { borderColor: 'lime' },
  '100%': { borderColor: 'black' },
})

const useStyles = createStyles(theme => ({
  stock: {
    backgroundColor: '#222',
    border: '1px dotted gray',
    color: 'white',
    overflow: 'clip',
    '@media (max-width: 600px)': {
      minWidth: '250px',
    },
    height: '100%',
  },
  stockText: {
    fontFamily: 'monospace',
  },
  stockTextPositive: {
    color: theme.colors.green[5],
  },
  stockTextNegative: {
    color: theme.colors.red[5],
  },
  stockTextNeutral: {
    color: theme.colors.gray[5],
  },
  stockActivity: {
    backgroundColor: theme.colors.green[8],
    border: '1px solid black',
    animation: `${borderAnimation} 4s linear infinite`,
    position: 'relative',
  },
}))
