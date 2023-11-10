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
import { StockMarketProductNode } from '../types.graphql'

interface SociStockProductProps {
  stock: StockMarketProductNode
}

export const SociStockProduct: React.FC<SociStockProductProps> = ({
  stock,
}) => {
  const { classes, cx } = useStyles()
  const theme = useMantineTheme()
  return (
    <Card className={classes.stock}>
      <Group noWrap>
        <ThemeIcon size={60}>
          <IconMoneybag size={58} />
        </ThemeIcon>
        <Stack spacing={0}>
          <Title className={classes.stockText} order={1}>
            {stock.name}
          </Title>
          <Group noWrap>
            <Title
              className={cx(classes.stockText, {
                [classes.stockTextPositive]: stock.percentageChange > 0,
                [classes.stockTextNegative]: stock.percentageChange < 0,
              })}
              order={1}
            >
              {stock.price}
            </Title>
            {stock.percentageChange > 0 ? (
              <IconTriangle
                color={theme.colors.green[4]}
                fill={theme.colors.green[4]}
                size={24}
              />
            ) : (
              <IconTriangleInverted
                color={theme.colors.red[4]}
                fill={theme.colors.red[4]}
                size={24}
              />
            )}
            <Title
              className={cx(classes.stockText, {
                [classes.stockTextPositive]: stock.percentageChange > 0,
                [classes.stockTextNegative]: stock.percentageChange < 0,
              })}
              order={2}
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
