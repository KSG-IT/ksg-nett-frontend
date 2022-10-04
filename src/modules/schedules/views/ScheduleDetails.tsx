import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Card,
  createStyles,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconRefresh } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { gql } from 'graphql-tag'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { format } from 'util/date-fns'
import { ShiftRenderer } from '../components/ScheduleDetails/ShiftRenderer'
import { ScheduleDisplayModeValues } from '../consts'
import { SCHEDULE_QUERY } from '../queries'

const TEMP_GENERATE = gql`
  mutation Generate($scheduleId: ID!, $startDate: Date!, $numberOfDays: Int!) {
    generate(
      scheduleTemplateId: $scheduleId
      startDate: $startDate
      numberOfWeeks: $numberOfDays
    ) {
      shiftsCreated
    }
  }
`

function useShiftMutations() {
  const [generate] = useMutation(TEMP_GENERATE)

  return { generate }
}

interface ScheduleDetailsParams {
  id: string
}

export const ScheduleDetails: React.FC = () => {
  const { classes } = useScheduleDetailsStyles()
  const { id } = useParams<
    keyof ScheduleDetailsParams
  >() as ScheduleDetailsParams

  /**
   *       scheduleTemplateId: "U2NoZWR1bGVUZW1wbGF0ZU5vZGU6MQ=="
      startDate: "2022-10-04"
      numberOfWeeks: 2
   */

  const { generate } = useShiftMutations()

  function handleGenerate() {
    generate({
      variables: {
        scheduleId: 'U2NoZWR1bGVUZW1wbGF0ZU5vZGU6Mg==',
        // scheduleId: 'U2NoZWR1bGVUZW1wbGF0ZU5vZGU6Mg==',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        numberOfDays: 2,
      },
      refetchQueries: [SCHEDULE_QUERY],
      onCompleted: () => {
        toast.success('Generated shifts')
      },
      onError: err => {
        toast.error(err.message)
      },
    })
  }

  const [shiftsFrom, setShiftsFrom] = useState<Date>(new Date())
  const [numberOfWeeks, setNumberOfWeeks] = useState(2)

  const { data, loading, error } = useQuery(SCHEDULE_QUERY, {
    variables: {
      id,
      shiftsFrom: format(shiftsFrom, 'yyyy-MM-dd'),
      numberOfWeeks,
    },
  })

  if (error) {
    return <FullPageError />
  }

  if (loading || !data) {
    return <FullContentLoader />
  }

  const { schedule } = data
  const { shiftsFromRange: shifts, displayMode } = schedule

  return (
    <div className={classes.wrapper}>
      <Title className={classes.title}>Vaktplan {schedule.name}</Title>

      <Card className={classes.controls} shadow="sm">
        <Group position="apart" align={'flex-end'}>
          <Group align={'flex-end'}>
            <Select label={'Uke'} data={[]} />
            <NumberInput label="Antall uker" />
            <Stack spacing={0}>
              <label>Visningsmodus</label>
              <Text weight="bold">{displayMode}</Text>
            </Stack>
            <Button leftIcon={<IconRefresh />}>Oppdater</Button>
          </Group>
          <Button onClick={handleGenerate}>Generer vakter fra mal</Button>
        </Group>
      </Card>

      <div className={classes.shifts}>
        <ShiftRenderer
          schedule={schedule}
          shiftsFrom={shiftsFrom}
          numberOfWeeks={numberOfWeeks}
        />
      </div>

      {/* <ShiftWeek
        displayMode={ScheduleDisplayModeValues.SINGLE_LOCATION}
        shifts={shifts}
      /> */}
    </div>
  )
}

const useScheduleDetailsStyles = createStyles(theme => ({
  wrapper: {
    display: 'grid',
    gridTemplateAreas: `
      "title ."
      "controls controls"
      "shifts shifts"
    `,
    gap: theme.spacing.md,
  },
  title: {
    gridArea: 'title',
  },
  controls: {
    gridArea: 'controls',
  },
  shifts: {
    gridArea: 'shifts',
    display: 'flex',
    flexDirection: 'column',
  },
}))
