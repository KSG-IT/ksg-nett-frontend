import { useQuery } from '@apollo/client'
import { Box, Card, Group, Stack, Text, Title } from '@mantine/core'
import {
  IconMoneybag,
  IconTriangle,
  IconTriangleInverted,
} from '@tabler/icons-react'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useIsMobile } from 'util/hooks'
import { SOCI_PRODUCT } from '../queries'
import {
  SociProductReturns,
  StockMarketDataPoints,
  StockMarketProductNode,
} from '../types.graphql'
import { createStyles } from '@mantine/emotion'

interface SociStockProductProps {
  stock: StockMarketProductNode
  showMarketHistory?: boolean
}

export const SociStockProduct: React.FC<SociStockProductProps> = ({
  stock,
  showMarketHistory,
}) => {
  const { classes, cx } = useStyles()
  const isMobile = useIsMobile()

  const { data, loading, error } = useQuery<SociProductReturns>(SOCI_PRODUCT, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: stock.id,
    },
  })

  if (error) return <FullPageError error={error} />
  if (loading || !data) return <FullContentLoader />

  const { sociProduct } = data

  return (
    <Card className={classes.stock}>
      <Group wrap="nowrap" justify="space-between">
        <Group align="flex-end" wrap="nowrap">
          {sociProduct.icon ? (
            <Text size="48px">{sociProduct.icon}</Text>
          ) : (
            <IconMoneybag />
          )}
          <Stack gap={0}>
            <Title className={classes.stockText} order={isMobile ? 4 : 1}>
              {stock.name}
            </Title>
            <Group wrap="nowrap" gap={0}>
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
                  color="var(--mantine-color-green-4)"
                  fill="var(--mantine-color-green-4)"
                  size={isMobile ? 12 : 24}
                  style={{ marginRight: '5px' }}
                />
              ) : (
                <IconTriangleInverted
                  color="var(--mantine-color-red-4)"
                  fill="var(--mantine-color-red-4)"
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
            <Group gap={2} wrap="nowrap" align="flex-end" justify="flex-end">
              {stock.marketHistory?.map((order: StockMarketDataPoints) => {
                return (
                  <Box
                    className={classes.stockActivity}
                    style={{
                      height: `${1.5 * order.price}px`,
                      maxHeight: '160px',
                      width: `300px / ${stock.marketHistory?.length}px`,
                      minWidth: '8px',
                      maxWidth: '300px',
                    }}
                  />
                )
              })}
            </Group>
          </Box>
        )}
      </Group>
    </Card>
  )
}

const useStyles = createStyles({
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
    color: 'var(--mantine-color-green-5)',
  },
  stockTextNegative: {
    color: 'var(--mantine-color-red-5)',
  },
  stockTextNeutral: {
    color: 'var(--mantine-color-gray-5)',
  },
  stockActivity: {
    backgroundColor: 'var(--mantine-color-green-8)',
    border: '1px solid black',
    position: 'relative',
  },
})
