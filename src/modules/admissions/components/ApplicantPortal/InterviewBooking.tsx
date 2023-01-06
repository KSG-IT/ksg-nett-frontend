import { useMutation, useQuery } from '@apollo/client'
import { Button, Group, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { BOOK_INTERRVIEW_MUTATION } from 'modules/admissions/mutations'
import { INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY } from 'modules/admissions/queries'
import { InterviewsAvailableForBookingReturns } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { InterviewsAvailableForBooking } from './components/InterviewsAvailableForBooking'

interface InterviewBookingProps {
  applicantToken: string
}

export const InterviewBooking: React.FC<InterviewBookingProps> = ({
  applicantToken,
}) => {
  const [dayOffset, setDayOffset] = useState(0)

  const { data, error, loading } =
    useQuery<InterviewsAvailableForBookingReturns>(
      INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY,
      {
        pollInterval: 20_000,
        fetchPolicy: 'network-only',
        variables: {
          dayOffset: dayOffset,
        },
      }
    )
  const [bookInterview] = useMutation(BOOK_INTERRVIEW_MUTATION)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleBookInterview = (interviewIds: string[]) => {
    if (confirm('Er du sikker på dette tidspunktet?')) {
      bookInterview({
        variables: {
          interviewIds: interviewIds,
          applicantToken: applicantToken,
        },
        refetchQueries: ['GetApplicantFromToken'],
        onCompleted() {
          showNotification({
            title: 'Intervjuet er booket',
            message: 'Intervjuet er booket',
            color: 'green',
          })
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
      <InterviewsAvailableForBooking
        interviews={data.interviewsAvailableForBooking}
        handleCallback={handleBookInterview}
      />
      <Group>
        <Button
          disabled={dayOffset === 0}
          color="samfundet-red"
          variant={'outline'}
          onClick={() => {
            setDayOffset(dayOffset - 2)
          }}
        >
          Gå tilbake 2 dager
        </Button>
        <Button
          color="samfundet-red"
          variant={'outline'}
          onClick={() => {
            setDayOffset(dayOffset + 2)
          }}
        >
          Gå frem 2 dager
        </Button>
      </Group>
    </Stack>
  )
}
