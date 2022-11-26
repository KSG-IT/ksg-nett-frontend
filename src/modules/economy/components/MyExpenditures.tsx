import { useQuery } from '@apollo/client'
import { createStyles, Paper, Select } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styled from 'styled-components'
import { format } from 'util/date-fns'
import { numberWithSpaces } from 'util/parsing'
import { MY_EXPENDITURES } from '../queries'
import {
  ExpenditureDateRangeEnum,
  MyExpendituresReturns,
  MyExpendituresVariables,
} from '../types.graphql'

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
    name: format(new Date(day.day), 'd MMM'),
    value: day.sum,
  }))

  return (
    <>
      <Select
        label={'Periode'}
        data={dateRangeOptions}
        defaultValue={dateRangeOptions[0].value}
      />
      <ResponsiveContainer width={'90%'} height={400}>
        <BarChart data={parsedData} width={300} height={400}>
          <XAxis dataKey={'name'} />
          <YAxis />
          <Tooltip filterNull />
          <Legend />
          <Bar dataKey={'kr'} fill={'maroon'} />
        </BarChart>
      </ResponsiveContainer>

      <TotalRow className={classes.totalRow}>
        <TotalLabel>Sum</TotalLabel>
        <TotalValue>{numberWithSpaces(moneySpent)} kr</TotalValue>
      </TotalRow>
    </>
  )
}

const useStyles = createStyles(theme => ({
  totalRow: {
    maxWidth: '700px',
  },
}))
