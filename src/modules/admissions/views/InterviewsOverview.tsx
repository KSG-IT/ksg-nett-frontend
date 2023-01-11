import { useQuery } from '@apollo/client'
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
import { showNotification } from '@mantine/notifications'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { PERMISSIONS } from 'util/permissions'
import { AddInterviewForm } from '../components/InterviewOverview.tsx'
import { useInterviewMutations } from '../mutations.hooks'
import { INTERVIEW_OVERRVIEW_QUERY } from '../queries'

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

export const InterviewsOverview: React.FC = () => {
  const { classes } = useStyles()
  const [addInterviewModalOpen, setAddInterviewModalOpen] = useState(false)
  const [date, setDate] = useState(new Date())

  const { deleteInterview } = useInterviewMutations()

  const { data, loading, error } = useQuery(INTERVIEW_OVERRVIEW_QUERY, {
    variables: {
      date: format(date, 'yyyy-MM-dd'),
    },
    pollInterval: 10_000,
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
        interviewId: interview.interviewId,
      }
    })
  })

  const parsedCellItems = [...headerRow, ...locationColumn, ...cellItems.flat()]

  function handleDeleteInterview(interviewId: string) {
    if (!interviewId) return

    const confirm = window.confirm(
      'Er du sikker på at du vil slette intervjuet?'
    )
    if (!confirm) return

    deleteInterview({
      variables: { id: interviewId },
      refetchQueries: [INTERVIEW_OVERRVIEW_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Intrvju slettet',
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message: message,
          color: 'red',
        })
      },
    })
  }

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />

      <Group position="apart">
        <Title>Intervjuoversikt</Title>
        <PermissionGate permissions={PERMISSIONS.admissions.add.interview}>
          <Button onClick={() => setAddInterviewModalOpen(true)}>
            Opprett intervju
          </Button>
        </PermissionGate>
      </Group>
      <MessageBox type="info">
        Du kan slette tomme intervjuer ved å trykke på de
      </MessageBox>
      <Group>
        <DatePicker value={date} onChange={val => val && setDate(val)} />
      </Group>
      <Paper>
        <div className={classes.grid}>
          {parsedCellItems.map(cellItem => (
            <GridItemCell
              onClick={() => handleDeleteInterview(cellItem.interviewId)}
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
    borderCollapse: 'collapse',
  },
}))

type GridItem = {
  colStart: number
  rowStart: number
  color: string
  firstRowOrColumn: boolean
}

type GridItemProp = {
  colStart: number
  rowStart: number
  name: string
  color: string
  onClick?: () => void
}

const GridItemCell: React.FC<GridItemProp> = ({
  colStart,
  rowStart,
  name,
  color,
  onClick,
}) => {
  const firstRowOrColumn = rowStart === 1 || colStart === 1
  const { classes } = useGridItemStyles({
    colStart,
    rowStart,
    color,
    firstRowOrColumn,
  })

  return (
    <div className={classes.gridItem} onClick={onClick}>
      {name}
    </div>
  )
}

const useGridItemStyles = createStyles(
  (theme, { colStart, rowStart, color, firstRowOrColumn }: GridItem) => ({
    gridItem: {
      backgroundColor: color,
      gridColumnStart: colStart,
      gridColumnEnd: colStart + 1,
      gridRowStart: rowStart,
      gridRowEnd: rowStart + 1,
      fontSize: 12,
      width: 150,
      color: 'yellow',
      height: 60,
      display: 'flex',
      padding: theme.spacing.xs,
      ':hover': {
        backgroundColor: 'orange',
        cursor: 'pointer',
      },
    },
  })
)
