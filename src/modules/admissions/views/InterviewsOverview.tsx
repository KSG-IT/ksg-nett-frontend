import { gql, useQuery } from '@apollo/client'
import {
  Button,
  createStyles,
  Group,
  Modal,
  Paper,
  Stack,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { AddInterviewForm } from '../components/InterviewOverview.tsx'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Intervjuoverdsikt', path: '' },
]

type CellItem = {
  time: string
  content: string
  applicantId: string | null
  interviewId: string
  color: string
}

type RowItem = {
  location: string
  interviews: CellItem[]
}

export const INTERVIEW_OVERRVIEW_QUERY = gql`
  query InterviewOverview($date: Date!) {
    interviewOverview(date: $date) {
      locations
      timestampHeader
      interviewRows {
        location
        interviews {
          time
          content
          color
        }
      }
    }
  }
`

export const InterviewsOverview: React.FC = () => {
  const { classes } = useStyles()
  const [addInterviewModalOpen, setAddInterviewModalOpen] = useState(false)
  const [date, setDate] = useState(new Date())

  const { data, loading, error } = useQuery(INTERVIEW_OVERRVIEW_QUERY, {
    variables: {
      date: format(date, 'yyyy-MM-dd'),
    },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { interviewOverview } = data
  const { interviewRows, locations, timestampHeader } = interviewOverview

  const locationRowDict: any = {}
  const timeColumnDict: any = {}

  locations.forEach((location: string, index: number) => {
    locationRowDict[location] = index + 1
  })

  timestampHeader.forEach((time: string, index: number) => {
    timeColumnDict[time] = index + 1
  })

  const headerRow = timestampHeader.map((time: string) => ({
    rowIndex: 1,
    columnIndex: timeColumnDict[time] + 1,
    name: time,
    color: '',
  }))

  const locationColumn = locations.map((location: string) => ({
    rowIndex: locationRowDict[location] + 1,
    columnIndex: 1,
    name: location,
    color: '',
  }))

  const cellItems = interviewRows.map((cellItem: RowItem) => {
    const rowIndex = locationRowDict[cellItem.location] + 1
    return cellItem.interviews.map(interview => {
      const columnIndex = timeColumnDict[interview.time] + 1
      return {
        rowIndex,
        columnIndex,
        name: interview.content,
        color: interview.color,
        time: interview.time,
      }
    })
  })

  const parsedCellItems = [...headerRow, ...locationColumn, ...cellItems.flat()]

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <DatePicker value={date} onChange={val => val && setDate(val)} />
      <Group position="apart">
        <Title>Intervjuoversikt</Title>
        <Button onClick={() => setAddInterviewModalOpen(true)}>
          Opprett intervju
        </Button>
      </Group>
      <Paper>
        <div className={classes.grid}>
          {parsedCellItems.map(cellItem => (
            <GridItemCell
              colStart={cellItem.columnIndex}
              rowStart={cellItem.rowIndex as number}
              name={cellItem.name}
              color={cellItem.color}
            />
          ))}
        </div>
      </Paper>
      <Modal
        opened={addInterviewModalOpen}
        onClose={() => setAddInterviewModalOpen(false)}
      >
        <AddInterviewForm
          onCloseCallback={() => setAddInterviewModalOpen(false)}
        />
      </Modal>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  grid: {
    padding: theme.spacing.sm,
    display: 'grid',
    overflowX: 'scroll',
    backgroundColor: 'hotpink',
    rowGap: 5,
    columnGap: 5,
    gridTemplateColumns: 'repeat(21, 1fr)',
    gridTemplateRows: 'auto',
  },
}))

type GridItem = {
  colStart: number
  rowStart: number
  color: string
}

type GridItemProp = {
  colStart: number
  rowStart: number
  name: string
  color: string
}

const GridItemCell: React.FC<GridItemProp> = ({
  colStart,
  rowStart,
  name,
  color,
}) => {
  const { classes } = useGridItemStyles({
    colStart,
    rowStart,
    color,
  })

  return <div className={classes.gridItem}>{name}</div>
}

const useGridItemStyles = createStyles(
  (theme, { colStart, rowStart, color }: GridItem) => ({
    gridItem: {
      backgroundColor: color,
      gridColumnStart: colStart,
      gridColumnEnd: colStart + 1,
      gridRowStart: rowStart,
      gridRowEnd: rowStart + 1,
      fontSize: 12,
      width: 100,
      color: 'yellow',
      height: 40,
    },
  })
)
