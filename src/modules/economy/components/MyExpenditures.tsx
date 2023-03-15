import { useQuery } from '@apollo/client'
import {
  createStyles,
  Group,
  Select,
  Text,
  useMantineTheme,
} from '@mantine/core'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title as ChartTitle,
  Tooltip,
} from 'chart.js'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { Bar } from 'react-chartjs-2'
import { format } from 'util/date-fns'
import { numberWithSpaces } from 'util/parsing'
import { MY_EXPENDITURES } from '../queries'
import {
  ExpenditureDateRangeEnum,
  MyExpendituresReturns,
  MyExpendituresVariables,
} from '../types.graphql'

interface MyExpendituresProps {
  moneySpent: number
}

export const MyExpenditures: React.FC<MyExpendituresProps> = ({
  moneySpent,
}) => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const { loading, error, data } = useQuery<
    MyExpendituresReturns,
    MyExpendituresVariables
  >(MY_EXPENDITURES, {
    variables: { dateRange: ExpenditureDateRangeEnum['THIS_MONTH'] },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />
  const dateRangeOptions = [
    {
      value: ExpenditureDateRangeEnum['THIS_MONTH'],
      label: 'Siste måned',
    },
    {
      value: 'THIS_SEMESTER',
      label: 'Siste semester (Kommer snart)',
    },
    {
      value: 'ALL_SEMESTERS',
      label: 'Alle semestere (Kommer snart)',
    },
    {
      value: 'ALL_YEARS',
      label: 'Alle år (Kommer snart)',
    },
  ]

  const parsedData = data.myExpenditures.data.map(day => ({
    date: format(new Date(day.day), 'd MMM'),
    sum: day.sum,
  }))

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
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
        text: 'Utgifter',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  }

  const labels = parsedData.map(day => day.date)

  const graphData = {
    labels: labels,
    datasets: [
      {
        label: 'Utgifter',
        data: parsedData.map(day => day.sum),
        backgroundColor: theme.colors[theme.primaryColor][3],
      },
    ],
  }

  return (
    <>
      <Select
        label={'Periode'}
        data={dateRangeOptions}
        defaultValue={dateRangeOptions[0].value}
      />
      <Bar options={chartOptions} data={graphData} />

      <Group position="apart">
        <Text weight={'bold'}>Sum</Text>
        <Text weight="bold">{numberWithSpaces(moneySpent)} kr</Text>
      </Group>
    </>
  )
}

const useStyles = createStyles(theme => ({
  totalRow: {
    maxWidth: '700px',
  },
  barChart: {
    padding: '0px',
    margin: '0px',
  },
}))
