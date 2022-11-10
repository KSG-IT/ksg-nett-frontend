import { useMutation, useQuery } from '@apollo/client'
import { Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { BOOK_INTERRVIEW_MUTATION } from 'modules/admissions/mutations'
import { INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY } from 'modules/admissions/queries'
import { InterviewsAvailableForBookingReturns } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { format } from 'util/date-fns'

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
        pollInterval: 20000,
        variables: {
          dayOffset: dayOffset,
        },
      }
    )
  const [bookInterview] = useMutation(BOOK_INTERRVIEW_MUTATION)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleBookInterview = (interviewIds: string[]) => {
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
  return (
    <Stack>
      <MessageBox type="info">
        <Text>
          Det kan hende prøver å booke intervjutid samtidig. Dette kan medføre
          at tidspunkter forsvinner om du ikke velger et tidspunkt raskt nok.
        </Text>
        <Text>
          For at vi ikke skal glemme å sette opp intervjuere er det tidligst
          mulig å booke et intervju neste dag.
        </Text>
        <Text>Helst book et intevju så tidlig som mulig.</Text>
      </MessageBox>
      {data.interviewsAvailableForBooking.map(day => {
        return (
          <Stack key={`${day.date}`}>
            <Title order={2}>Tilgjengelige tidspunkter</Title>
            <Group position="apart">
              {format(new Date(day.date), 'EEEE dd MMM')}
              <Group>
                {day.interviewSlots.map((slot, i) => {
                  const unavailable = slot.interviewIds.length === 0
                  return (
                    <Button
                      key={i}
                      disabled={unavailable}
                      onClick={() => {
                        handleBookInterview(slot.interviewIds)
                      }}
                    >
                      {format(new Date(slot.interviewStart), 'HH:mm')}
                    </Button>
                  )
                })}
              </Group>
            </Group>
          </Stack>
        )
      })}
      {data.interviewsAvailableForBooking.length === 0 && (
        <Container color="gray">
          Oi, her var det tomt. Det er ikke flere tilgjengelige tidspunkter
          disse dagene
        </Container>
      )}
      <Title order={3}>Ingen av tidspunktene passer</Title>
      <Group>
        <Button
          disabled={dayOffset === 0}
          color="samfundet-red"
          onClick={() => {
            setDayOffset(dayOffset - 2)
          }}
        >
          -2 dager
        </Button>
        <Button
          color="samfundet-red"
          onClick={() => {
            setDayOffset(dayOffset + 2)
          }}
        >
          +2 dager
        </Button>
      </Group>
    </Stack>
  )
}
