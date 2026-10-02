import { useQuery } from '@apollo/client'
import { Group, NumberFormatter, Select, Text } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { BarChart } from '@mantine/charts'
import { format } from 'util/date-fns'
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
      <BarChart
        h={400}
        data={parsedData}
        dataKey="date"
        series={[{ name: 'sum', label: 'Sum', color: 'samfundet-red.6' }]}
        valueFormatter={value => `${value} kr`}
      />

      <Group justify="space-between">
        <Text fw={'bold'}>Sum</Text>
        <Text fw="bold">
          <NumberFormatter value={moneySpent} suffix=" kr" />
        </Text>
      </Group>
    </>
  )
}
