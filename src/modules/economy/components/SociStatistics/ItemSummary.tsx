import { useQuery } from '@apollo/client'
import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PRODUCT_ORDERS_BY_ITEM_AND_DATE_LIST_QUERY } from 'modules/economy/queries'
import {
  ProductOrdersByItemAndDateListReturns,
  ProductOrdersByItemAndDateListVariables,
} from 'modules/economy/types.graphql'
import { useCurrencyFormatter } from 'util/hooks'

interface ItemSummaryProps {
  productIds: string[]
  dateFrom: string
  dateTo: string
}

export const ItemSummary: React.FC<ItemSummaryProps> = ({
  productIds,
  dateFrom,
  dateTo,
}) => {
  const { formatCurrency } = useCurrencyFormatter()
  const { data, loading, error } = useQuery<
    ProductOrdersByItemAndDateListReturns,
    ProductOrdersByItemAndDateListVariables
  >(PRODUCT_ORDERS_BY_ITEM_AND_DATE_LIST_QUERY, {
    variables: {
      productIds: productIds,
      dateFrom: dateFrom,
      dateTo: dateTo,
    },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const productData = data.productOrdersByItemAndDateList

  const sum = productData.reduce((acc, curr) => {
    return acc + curr.total
  }, 0)

  const avg =
    productData.reduce((acc, curr) => {
      return acc + curr.average
    }, 0) / productData.length

  const quantity = productData.reduce((acc, curr) => {
    return acc + curr.quantity
  }, 0)

  const theme = useMantineTheme()

  return (
    <Card>
      <Title ff={theme.fontFamily} mb="md" color={'dimmed'} order={2}>
        Nøkkeltall
      </Title>
      <Group position="left" mb="md">
        <Stack>
          <Badge size="lg">Total omsetning</Badge>
          <Badge size="lg">Snitt per åpen dag</Badge>
          <Badge size="lg">Solgte varer</Badge>
        </Stack>
        <Stack>
          <Text size={'lg'}>{formatCurrency(sum)}</Text>
          <Text size={'lg'}>{formatCurrency(avg)}</Text>
          <Text size={'lg'}>{quantity} stk.</Text>
        </Stack>
      </Group>
    </Card>
  )
}
