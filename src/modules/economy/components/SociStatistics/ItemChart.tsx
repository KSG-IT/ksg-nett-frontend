import { useQuery } from '@apollo/client'
import { Card, useMantineTheme } from '@mantine/core'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title as ChartTitle,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { format } from 'util/date-fns'
import { FullPageError } from '../../../../components/FullPageComponents'
import { FullContentLoader } from '../../../../components/Loading'
import { PRODUCT_ORDERS_BY_ITEM_AND_DATE_QUERY } from '../../queries'
import {
  ExpenditureDay,
  ProductOrdersByItemAndDateReturns,
  ProductOrdersByItemAndDateVariables,
} from '../../types.graphql'

interface ItemChartProps {
  productId: string
  dateFrom: string
  dateTo: string
}

export const ItemChart: React.FC<ItemChartProps> = ({
  productId,
  dateFrom,
  dateTo,
}) => {
  const { data, loading, error } = useQuery<
    ProductOrdersByItemAndDateReturns,
    ProductOrdersByItemAndDateVariables
  >(PRODUCT_ORDERS_BY_ITEM_AND_DATE_QUERY, {
    variables: {
      productId: productId,
      dateFrom: dateFrom,
      dateTo: dateTo,
    },
  })
  const theme = useMantineTheme()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const productData = data.productOrdersByItemAndDate

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartTitle,
    Tooltip,
    Legend
  )

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text:
          'Omsetning fra ' +
          format(new Date(dateFrom), 'dd.MMMM') +
          ' til ' +
          format(new Date(dateTo), 'dd.MMMM'),
      },
    },
  }

  const labels = productData.data.map((item: ExpenditureDay) =>
    format(new Date(item.day), 'dd.MM')
  )

  const graphData = {
    labels,
    datasets: [
      {
        label: 'Målt i kr per dag',
        data: productData.data.map((item: ExpenditureDay) => item.sum),
        backgroundColor: theme.colors[theme.primaryColor][3],
      },
    ],
  }

  return (
    <Card p="md">
      <Line options={chartOptions} data={graphData} />
    </Card>
  )
}
