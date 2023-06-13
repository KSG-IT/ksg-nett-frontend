import { useQuery } from '@apollo/client'
import { Card, useMantineTheme } from '@mantine/core'
import {
  Chart as ChartJS,
  ChartOptions,
  Title as ChartTitle,
  Colors,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PRODUCT_ORDERS_BY_ITEM_AND_DATE_LIST_QUERY } from 'modules/economy/queries'
import {
  ExpenditureDay,
  ProductOrdersByItemAndDateListReturns,
  ProductOrdersByItemAndDateListVariables,
  TotalExpenditureItem,
} from 'modules/economy/types.graphql'
import { randomizeColors } from 'modules/economy/utils'
import { Line } from 'react-chartjs-2'
import { format } from 'util/date-fns'

interface ItemChartProps {
  productIds: string[]
  dateFrom: string
  dateTo: string
}

export const ItemChart: React.FC<ItemChartProps> = ({
  productIds,
  dateFrom,
  dateTo,
}) => {
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
  const theme = useMantineTheme()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const productData = data.productOrdersByItemAndDateList

  ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    ChartTitle,
    Tooltip,
    Legend,
    TimeScale,
    Colors
  )

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        display: true,
        title: {
          display: true,
          text: 'Dato',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Omsetning',
        },
      },
    },

    plugins: {
      colors: {
        enabled: true,
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text:
          'Omsetning fra ' +
          format(new Date(dateFrom), 'dd.MMMM') +
          ' til ' +
          format(new Date(dateTo), 'dd.MMMM'),
        font: { size: 20, family: theme.fontFamily },
        color: theme.colors.gray[6],
      },
    },
  }

  const colorSelection = randomizeColors()

  function createDataset(product: TotalExpenditureItem) {
    const color = colorSelection.shift()
    return {
      label: product.name,
      data: product.data.map((item: ExpenditureDay) => ({
        x: item.day,
        y: item.sum,
      })),
      backgroundColor: color ? theme.colors[color][1] : '#000',
      color: color ? theme.colors[color][2] : '#000',
      borderColor: color ? theme.colors[color][3] : '#000',
    }
  }

  const graphData = {
    datasets: productData.map((product: TotalExpenditureItem) =>
      createDataset(product)
    ),
  }

  return (
    <Card p="md" style={{ width: '99%', height: '400px' }}>
      <Line options={chartOptions} data={graphData} />
    </Card>
  )
}
