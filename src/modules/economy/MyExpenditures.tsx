import { useQuery } from '@apollo/client'
import { Paper, Select } from '@mantine/core'
import { format } from 'date-fns'
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts'
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
    name: format(new Date(day.day), 'd MMM'),
    value: day.sum,
  }))

  return (
    <Paper shadow={'lg'} p="md">
      <Select
        label={'Periode'}
        data={dateRangeOptions}
        defaultValue={dateRangeOptions[0].value}
      />

      <BarChart width={700} height={300} data={parsedData}>
        <Bar dataKey={'value'} fill={'hotpink'} unit=",- NOK" />
        <XAxis dataKey={'name'} />
        <YAxis dataKey={'value'} />
        <Tooltip filterNull />
      </BarChart>

      <TotalRow>
        <TotalLabel>Sum</TotalLabel>
        <TotalValue>{numberWithSpaces(3420)},- NOK </TotalValue>
      </TotalRow>
    </Paper>
  )
}
