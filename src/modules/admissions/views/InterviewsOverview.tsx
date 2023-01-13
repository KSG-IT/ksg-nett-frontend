import { useQuery } from '@apollo/client'
import {
  Button,
  Card,
  createStyles,
  Group,
  Modal,
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
import { INTERVIEW_TABLE_OVERVIEW_QUERY } from '../queries'
import { AssignInterviewModal } from '../components/AssignInterview'
import {
  InterviewLocationOverviewRow,
  InterviewOverviewCell,
  InterviewTableOverviewReturns,
} from '../types.graphql'
import { GridItemCell } from '../components/InterviewOverview.tsx/GridItemCell'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Intervjuoverdsikt', path: '' },
]

// this is to fill in the selected interview state with the correct data
type InterviewSelectedProps = {
  interviewId: string
  interviewStart: string
  location: string
}

// this is used for all cell items, to make sure that we can get interviewId and applicantId
// still needs some real typing overhaul to easily convert from the table data to the actual intverview data required
type CellItem = {
  rowIndex: number | any
  columnIndex: number | any
  name: string
  color: string
  interviewId?: string
  applicantId?: string
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
  const [interview, setInterview] = useState<InterviewSelectedProps | null>(
    null
  )

  const { deleteInterview } = useInterviewMutations()

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

  const locationRowDict: any = {}
  const timeColumnDict: any = {}

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

  function handleDeleteInterview(interviewId: string) {
    if (!interviewId) return

    const confirm = window.confirm(
      'Er du sikker på at du vil slette intervjuet?'
    )
    if (!confirm) return

    deleteInterview({
      variables: { id: interviewId },
      refetchQueries: [INTERVIEW_TABLE_OVERVIEW_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Intervju slettet',
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

  function handleAssignInterview(interviewId: string) {
    // getting interviewRow from interviewRows by interviewId
    const interview = interviewRows.find(
      (interview: InterviewLocationOverviewRow) =>
        interview.interviews.find(
          (interview: InterviewOverviewCell) =>
            interview.interviewId === interviewId
        )
    )
    // if it doesn't find it, it means that the interview is not assigned
    if (!interview) return
    // finding time of interview from interviewId:
    const interviewTime = interview.interviews.find(
      (interview: InterviewOverviewCell) =>
        interview.interviewId === interviewId
    )
    // then again for safety reasons or whatever we check this as well
    if (!interviewTime) return
    setInterview({
      interviewId: interviewId,
      location: interview.location,
      interviewStart: interviewTime?.time ?? '',
    })
    setAssignInterviewModalOpen(true)
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
      <Card className={classes.card} radius={'md'}>
        <div className={classes.grid}>
          {parsedCellItems.map((cellItem: CellItem) => (
            <GridItemCell
              onClick={
                cellItem?.applicantId
                  ? () => handleDeleteInterview(cellItem?.interviewId!)
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
      {interview && (
        <AssignInterviewModal
          interview={interview}
          opened={assignInterviewModalOpen}
          onClose={() => setAssignInterviewModalOpen(false)}
        />
      )}
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  grid: {
    display: 'grid',
    overflowX: 'scroll',
    backgroundColor: '#f7f3eb', //ugly beach color
    rowGap: 5,
    columnGap: 5,
    gridTemplateColumns: 'repeat(21, 1fr)',
    gridTemplateRows: 'auto',
    borderCollapse: 'collapse',
  },
  card: {
    border: '2px solid black',
    backgroundColor: '#f7f3eb', //same ugly beach color
  },
}))
