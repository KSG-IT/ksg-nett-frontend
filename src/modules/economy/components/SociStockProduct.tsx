import {
  Card,
  Group,
  Stack,
  ThemeIcon,
  Title,
  createStyles,
  useMantineTheme,
} from '@mantine/core'
import {
  IconMoneybag,
  IconTriangle,
  IconTriangleInverted,
} from '@tabler/icons-react'
import { useIsMobile } from 'util/hooks'
import { StockMarketProductNode } from '../types.graphql'

interface SociStockProductProps {
  stock: StockMarketProductNode
}

export const SociStockProduct: React.FC<SociStockProductProps> = ({
  stock,
}) => {
  const { classes, cx } = useStyles()
  const theme = useMantineTheme()
  const isMobile = useIsMobile()

  return (
    <Card className={classes.stock}>
      <Group noWrap>
        <ThemeIcon size={isMobile ? 30 : 60}>
          <IconMoneybag size={58} />
        </ThemeIcon>
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
            {stock.percentageChange > 0 ? (
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
    </Card>
  )
}

const useStyles = createStyles(theme => ({
  stock: {
    backgroundColor: '#222',
    border: '2px dotted gray',
    color: 'white',
    overflow: 'clip',
    '@media (max-width: 600px)': {
      minWidth: '250px',
    },
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
}))
