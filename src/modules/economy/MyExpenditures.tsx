import { useQuery } from '@apollo/client'
import { Paper, Select } from '@mantine/core'
import { format } from 'date-fns'
import { BarSeries, ChartProvider, Tooltip, XAxis, YAxis } from 'rough-charts'
import styled from 'styled-components'
import { numberWithSpaces } from 'util/parsing'
import { MY_EXPENDITURES } from './queries'
import {
  ExpenditureDateRangeEnum,
  MyExpendituresReturns,
  MyExpendituresVariables,
} from './types'

const TotalRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TotalLabel = styled.label``

const TotalValue = styled.span`
  font-size: 18px;
  font-weight: 600;
`

export const MyExpenditures: React.VFC = () => {
  const { loading, error, data } = useQuery<
    MyExpendituresReturns,
    MyExpendituresVariables
  >(MY_EXPENDITURES, {
    variables: { dateRange: ExpenditureDateRangeEnum['THIS_MONTH'] },
  })

  if (error) return <span>Error lol</span>

  if (loading || !data) return <span>Loading lol</span>

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
    name: format(new Date(day.day), 'd'),
    value1: day.sum,
  }))

  return (
    <Paper shadow={'lg'} p="md">
      <Select
        label={'Periode'}
        data={dateRangeOptions}
        defaultValue={dateRangeOptions[0].value}
      />

      <ChartProvider height={300} width={750} data={parsedData}>
        <XAxis dataKey="name" tickSize={15} tickCount={12} />
        <YAxis />
        <BarSeries
          dataKey="value1"
          options={{
            stroke: 'red',
            strokeWidth: 1,
            roughness: 3,
          }}
        />

        <Tooltip />
      </ChartProvider>

      <TotalRow>
        <TotalLabel>Sum</TotalLabel>
        <TotalValue>{numberWithSpaces(3420)},- NOK </TotalValue>
      </TotalRow>
    </Paper>
  )
}
