import { useMutation, useQuery } from '@apollo/client'
import { Button, Container, SimpleGrid, Stack, Text } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { isAfter } from 'date-fns'
import 'dayjs/locale/nb'
import { BOOK_INTERRVIEW_MUTATION } from 'modules/admissions/mutations'
import { INTERVIEW_PERIOD_DATES_QUERY } from 'modules/admissions/queries'
import { InterviewPeriodDatesReturns } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { InterviewsAvailableForBooking } from './components/InterviewsAvailableForBooking'

interface InterviewBookingProps {
  applicantToken: string
}

export const InterviewBooking: React.FC<InterviewBookingProps> = ({
  applicantToken,
}) => {
  const [selectedInterviews, setSelectedInterviews] = useState<string[]>([])
  const [day, setDay] = useState(new Date())
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
          nok. Helst book et intevju så tidlig som mulig.
        </Text>
      </MessageBox>
      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 600, cols: 1, spacing: 'sm' }]}
      >
        <Container>
          <DatePicker
            size={'md'}
            locale={'nb'}
            placeholder={'Klikk her for å velge dato'}
            minDate={
              isAfter(new Date(startDate), new Date())
                ? new Date(startDate)
                : new Date()
            }
            maxDate={new Date(endDate)}
            value={day}
            onChange={date => {
              date && handleDayChange(date)
            }}
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
