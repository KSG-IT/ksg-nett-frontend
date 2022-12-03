import { useQuery } from '@apollo/client'
import { createStyles, Group, Select, Text } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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

  return (
    <>
      <Select
        label={'Periode'}
        data={dateRangeOptions}
        defaultValue={dateRangeOptions[0].value}
      />
      <ResponsiveContainer width={'95%'} height={400}>
        <BarChart
          data={parsedData}
          width={300}
          height={400}
          className={classes.barChart}
        >
          <XAxis dataKey={'date'} />
          <YAxis />
          <Tooltip filterNull />
          <Legend />
          <Bar dataKey={'sum'} fill={'maroon'} />
        </BarChart>
      </ResponsiveContainer>

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
