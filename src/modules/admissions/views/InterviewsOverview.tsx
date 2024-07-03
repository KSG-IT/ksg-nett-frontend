import { useQuery } from '@apollo/client'
import {
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { PERMISSIONS } from 'util/permissions'
import { AssignInterviewModal } from '../components/AssignInterview'
import { AddInterviewForm } from '../components/InterviewOverview.tsx'
import { GridItemCell } from '../components/InterviewOverview.tsx/GridItemCell'
import { INTERVIEW_TABLE_OVERVIEW_QUERY } from '../queries'
import {
  InterviewLocationOverviewRow,
  InterviewTableOverviewReturns,
} from '../types.graphql'
import { createStyles } from '@mantine/emotion'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Intervjuoversikt', path: '' },
]

type CellItem = {
  rowIndex: number | any
  columnIndex: number | any
  name: string
  color: string
  interviewId?: string
  applicantId?: string
}

// Allows us to set the key programatically. We use this as a way to map a name or a timestamp to a given grid index
type DynamicIndexDict = {
  [key: string]: number
}

export const InterviewsOverview: React.FC = () => {
  /**
   * Should get the data and pass it to a component which memoized the value.
   * The order of things is handled on the backend and parses timestamps using
   * local time with the timezone on server settings
   */
  const { classes } = useStyles()
  const [addInterviewModalOpen, setAddInterviewModalOpen] = useState(false)
  const [assignInterviewModalOpen, setAssignInterviewModalOpen] =
    useState(false)
  const [date, setDate] = useState(new Date())
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(
    null
  )

  const { data, loading, error } = useQuery<InterviewTableOverviewReturns>(
    INTERVIEW_TABLE_OVERVIEW_QUERY,
    {
      variables: {
        date: format(date, 'yyyy-MM-dd'),
      },
      pollInterval: 10_000,
    }
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { interviewTableOverview } = data
  const { interviewRows, locations, timestampHeader } = interviewTableOverview

  const locationRowDict: DynamicIndexDict = {}
  const timeColumnDict: DynamicIndexDict = {}

  // Locations are retrieved from the backend and sorted by name
  locations.forEach((location: string, index: number) => {
    // css grid is 1-indexed
    locationRowDict[location] = index + 1
  })

  // The timestamps are generated on the backend using the schedule template
  // day start and default interview duration fields
  timestampHeader.forEach((time: string, index: number) => {
    // css grid is 1-indexed
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

  const cellItems = interviewRows.map(
    (cellItem: InterviewLocationOverviewRow) => {
      // cellitems need to be offset since grid is 1-indexed and the first row and column
      // is for location and timestamps
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
          applicantId: interview.applicantId,
        }
      })
    }
  )
  const parsedCellItems = [...headerRow, ...locationColumn, ...cellItems.flat()]

  function handleAssignInterview(interviewId: string) {
    setSelectedInterviewId(interviewId)
    setAssignInterviewModalOpen(true)
  }

  function handleIncrementDate() {
    setDate(new Date(date.setDate(date.getDate() + 1)))
  }

  function handleDecrementDate() {
    setDate(new Date(date.setDate(date.getDate() - 1)))
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

      <Group position="center" align={'center'}>
        <UnstyledButton onClick={handleDecrementDate}>
          <IconChevronLeft />
        </UnstyledButton>
        <DateInput
          value={date}
          onChange={val => val && setDate(val)}
          locale={'nb'}
        />
        <UnstyledButton>
          <IconChevronRight onClick={handleIncrementDate} />
        </UnstyledButton>
      </Group>
      <Card className={classes.card} radius={'md'} p={'xs'}>
        <div className={classes.grid}>
          <div
            style={{
              gridColumnStart: 1,
              gridColumnEnd: 1,
              gridRowStart: 1,
              gridRowEnd: 1,
            }}
          >
            {/* In case we want something in the corner here */}
          </div>
          {parsedCellItems.map((cellItem: CellItem) => (
            <GridItemCell
              onClick={
                cellItem?.applicantId
                  ? () => handleAssignInterview(cellItem?.interviewId!)
                  : () => handleAssignInterview(cellItem?.interviewId!)
              }
              colStart={cellItem.columnIndex}
              rowStart={cellItem.rowIndex as number}
              name={cellItem.name}
              color={cellItem.color}
            />
          ))}
        </div>
      </Card>
      <Modal
        opened={addInterviewModalOpen}
        onClose={() => setAddInterviewModalOpen(false)}
      >
        <AddInterviewForm
          onCloseCallback={() => setAddInterviewModalOpen(false)}
        />
      </Modal>
      {selectedInterviewId && (
        <AssignInterviewModal
          opened={assignInterviewModalOpen}
          interviewId={selectedInterviewId}
          setInterviewIdCallback={setSelectedInterviewId}
          onClose={() => setAssignInterviewModalOpen(false)}
        />
      )}
    </Stack>
  )
}

const useStyles = createStyles(() => ({
  grid: {
    display: 'grid',
    overflowX: 'hidden',
    backgroundColor: '#f7f3eb', //ugly beach color
    rowGap: 5,
    columnGap: 5,
    gridTemplateColumns: 'repeat(21, 1fr)',
    gridTemplateRows: 'auto',
    borderCollapse: 'collapse',
    ':hover': {
      overflowX: 'scroll',
    },
  },
  card: {
    border: '2px solid black',
    backgroundColor: '#f7f3eb', //same ugly beach color
  },
}))
