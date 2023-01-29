import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Container,
  createStyles,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { Calendar } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { addDays, isAfter } from 'date-fns'
import { format } from 'util/date-fns'
import { BOOK_INTERRVIEW_MUTATION } from 'modules/admissions/mutations'
import { INTERVIEW_PERIOD_DATES_QUERY } from 'modules/admissions/queries'
import { InterviewPeriodDatesReturns } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { InterviewsAvailableForBooking } from './components/InterviewsAvailableForBooking'
import 'dayjs/locale/nb'

interface InterviewBookingProps {
  applicantToken: string
}

export const InterviewBooking: React.FC<InterviewBookingProps> = ({
  applicantToken,
}) => {
  const [selectedInterviews, setSelectedInterviews] = useState<string[]>([])
  const [day, setDay] = useState(new Date())
  const { classes, cx } = useStyles()
  const handleDayChange = (newDay: Date) => {
    setDay(newDay)
    setSelectedInterviews([])
  }
  const { data, error, loading } = useQuery<InterviewPeriodDatesReturns>(
    INTERVIEW_PERIOD_DATES_QUERY
  )
  const [bookInterview] = useMutation(BOOK_INTERRVIEW_MUTATION)
  const handleBookInterview = (interviewIds: string[]) => {
    if (confirm('Er du sikker på dette tidspunktet?')) {
      bookInterview({
        variables: {
          interviewIds: interviewIds,
          applicantToken: applicantToken,
        },
        refetchQueries: ['GetApplicantFromToken'],
        onCompleted({ bookInterview }) {
          const { ok } = bookInterview
          if (ok) {
            showNotification({
              title: 'Intervjuet er booket',
              message: 'Intervjuet er booket',
              color: 'green',
            })
          } else {
            showNotification({
              title: 'Intervjuet er ikke booket',
              message: 'Det var ikke mulig å booke intervjuet',
              color: 'red',
            })
          }
        },
        onError() {
          showNotification({
            title: 'Noe gikk galt',
            message:
              'Kan hende noen andre har booket samme intervju. Prøv et annet intervju annet',
            color: 'red',
          })
        },
      })
    }
  }

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const {
    interviewPeriodDates: { endDate, startDate },
  } = data

  return (
    <Stack style={{ maxWidth: 900 }}>
      <MessageBox type="info">
        <Text>
          Det kan hende at flere prøver å booke intervjutid samtidig. Dette kan
          medføre at tidspunkter forsvinner om du ikke velger et tidspunkt raskt
          nok. For at vi ikke skal glemme å sette opp intervjuere er det
          tidligst mulig å booke et intervju neste dag. Helst book et intevju så
          tidlig som mulig.
        </Text>
      </MessageBox>
      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 600, cols: 1, spacing: 'sm' }]}
      >
        <Container>
          <Calendar
            size={'md'}
            locale={'nb'}
            placeholder={'Klikk her for å velge dato'}
            minDate={
              isAfter(new Date(startDate), new Date())
                ? new Date(startDate)
                : addDays(new Date(), 1)
            }
            maxDate={new Date(endDate)}
            value={day}
            onChange={date => {
              date && handleDayChange(date)
            }}
            disableOutsideEvents
            dayClassName={(date, modifiers) =>
              cx({
                [classes.disabled]: modifiers.disabled,
                [classes.available]: !modifiers.disabled,
                [classes.weekend]: modifiers.weekend && !modifiers.disabled,
                [classes.selected]: modifiers.selected,
              })
            }
          />
        </Container>

        <Stack>
          <InterviewsAvailableForBooking
            dateSelected={format(day, 'yyyy-MM-dd')}
            handleCallback={setSelectedInterviews}
            currentlySelected={selectedInterviews}
          />
          <Button
            disabled={selectedInterviews.length === 0}
            onClick={() => {
              handleBookInterview(selectedInterviews)
            }}
          >
            Bekreft intervjutid
          </Button>
        </Stack>
      </SimpleGrid>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  disabled: {
    color: `${theme.colors.gray[3]} !important`,
    backgroundColor: `${theme.colors.white} !important`,
  },
  available: {
    color: `${theme.colors[theme.primaryColor][3]}`,
    border: `1px solid ${theme.colors.white}`,
    backgroundColor: `${theme.colors.red[1]}`,
    borderRadius: '50%',
    backgroundClip: 'content-box',
  },
  weekend: {
    color: `${theme.colors[theme.primaryColor][3]} !important`,
  },
  selected: {
    color: `${theme.colors.white} !important`,
  },
}))
