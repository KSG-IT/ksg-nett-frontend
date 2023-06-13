import { useQuery } from '@apollo/client'
import { Card, Group, useMantineTheme, Text } from '@mantine/core'
import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title as ChartTitle,
  Tooltip,
  TimeScale,
  ChartOptions,
  Colors,
  ArcElement,
  CategoryScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { Doughnut, Line } from 'react-chartjs-2'
import { format } from 'util/date-fns'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  PRODUCT_ORDERS_BY_ITEM_AND_DATE_LIST_QUERY,
  PRODUCT_ORDERS_BY_ITEM_AND_DATE_QUERY,
} from 'modules/economy/queries'
import {
  ExpenditureDay,
  ProductOrdersByItemAndDateListReturns,
  ProductOrdersByItemAndDateListVariables,
  ProductOrdersByItemAndDateReturns,
  ProductOrdersByItemAndDateVariables,
  TotalExpenditureItem,
} from 'modules/economy/types.graphql'
import { Item } from 'components/Select/SelectLabel'
import { randomizeColors } from 'modules/economy/utils'
import { formatISO } from 'date-fns'

interface ItemDoughnutProps {
  productIds: string[]
  dateFrom: string
  dateTo: string
}

export const ItemDoughnut: React.FC<ItemDoughnutProps> = ({
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

  ChartJS.register(ArcElement, Tooltip, Legend, ChartTitle, CategoryScale)
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
        title: {
          display: true,
          text: 'Dato',
        },
      },
      y: {
        display: false,
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
        position: 'right',
        align: 'center',
      },
      title: {
        display: true,
        text:
          'Fordeling av drikkevarer: ' +
          format(new Date(dateFrom), 'dd.MMMM') +
          ' til ' +
          format(new Date(dateTo), 'dd.MMMM'),
        font: {
          size: 20,
          family: theme.fontFamily,
        },
        color: theme.colors.gray[6],
      },
    },
  }

  const colorSelection = randomizeColors()

  function createDataset(product: TotalExpenditureItem) {
    const color = colorSelection.shift()
    return {
      label: `${product.name}, ${product.total ?? 0} kr`,
      data: product.quantity,
      color: color ? theme.colors[color][1] : '#000',
      borderColor: color ? theme.colors[color][3] : '#000',
    }
  }

  const datasets = productData.map(createDataset)

  const graphData = {
    labels: [...datasets.map(product => product.label)],
    datasets: [
      {
        label: 'Total drikkevare',
        data: [...datasets.map(product => product.data)],
        backgroundColor: [...datasets.map(product => product.color)],
        borderColor: [...datasets.map(product => product.borderColor)],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Card p="md" style={{ width: '99%', height: '400px' }}>
      <Doughnut options={chartOptions} data={graphData} />
    </Card>
  )
}
