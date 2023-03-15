import { Card, Group, Stack, Table, Text, Title } from '@mantine/core'
import { useQuery } from '@apollo/client'
import { PRODUCT_ORDERS_BY_ITEM_AND_DATE_QUERY } from '../queries'
import { FullContentLoader } from '../../../components/Loading'
import { FullPageError } from 'components/FullPageComponents'
import {
  ExpenditureDay,
  ProductOrdersByItemAndDateReturns,
  ProductOrdersByItemAndDateVariables,
  TotalExpenditure,
} from '../types.graphql'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title as ChartTitle,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

export const SociStatistics: React.FC = () => {
  //query product order by item and date

  const { data, loading, error } = useQuery<
    ProductOrdersByItemAndDateReturns,
    ProductOrdersByItemAndDateVariables
  >(PRODUCT_ORDERS_BY_ITEM_AND_DATE_QUERY, {
    variables: {
      productId: 'U29jaVByb2R1Y3ROb2RlOjE=',
      dateFrom: '2023-01-01',
      dateTo: '2023-09-09',
    },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const productData = data.productOrdersByItemAndDate

  console.log('noob', productData)

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    Tooltip,
    Legend
  )

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Expenditure Chart',
      },
    },
  }

  const labels = productData.data.map((item: ExpenditureDay) => item.day)

  const graphData = {
    labels,
    datasets: [
      {
        label: 'Expenditure',
        data: productData.data.map((item: ExpenditureDay) => item.sum),
        backgroundColor: 'rgb(255, 99, 132)',
      },
    ],
  }

  return (
    <Stack>
      <Title order={2}>Statistikk</Title>
      <Card withBorder>
        <Text align={'right'}>Select</Text>
      </Card>
      <Group>
        <Card withBorder>
          <div style={{ width: 300, height: 200 }}>
            <Bar options={options} data={graphData} />
          </div>
        </Card>
        <Card withBorder>
          <div style={{ width: 300, height: 200 }}>Graph</div>
        </Card>
        <Card withBorder>
          <div style={{ width: 300, height: 200 }}>Graph</div>
        </Card>
        <Card withBorder>
          <div style={{ width: 300, height: 200 }}>Graph</div>
        </Card>
        <Card withBorder>
          <div style={{ width: 300, height: 200 }}>Graph</div>
        </Card>
      </Group>
    </Stack>
  )
}
