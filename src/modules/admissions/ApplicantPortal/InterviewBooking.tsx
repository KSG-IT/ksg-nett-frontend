import { useMutation, useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Alert,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { BOOK_INTERRVIEW_MUTATION } from './mutations'
import { INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY } from './queries'
import { InterviewsAvailableForBookingReturns } from './types'

interface InterviewBookingProps {
  applicantToken: string
}

export const InterviewBooking: React.VFC<InterviewBookingProps> = ({
  applicantToken,
}) => {
  const [dayOffset, setDayOffset] = useState(0)
  const { data, error, loading } =
    useQuery<InterviewsAvailableForBookingReturns>(
      INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY,
      {
        pollInterval: 20000, // polls every 30 seconds
        variables: {
          dayOffset: dayOffset,
        },
      }
    )
  const [bookInterview] = useMutation(BOOK_INTERRVIEW_MUTATION, {
    refetchQueries: ['GetApplicantFromToken'],
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleBookInterview = (interviewIds: string[]) => {
    bookInterview({
      variables: {
        interviewIds: interviewIds,
        applicantToken: applicantToken,
      },
    }).then(res => {
      const {
        data: {
          bookInterview: { ok },
        },
      } = res
      if (!ok) {
        toast.error('Noe gikk galt, prøv igjen')
      }
    })
  }
  return (
    <Stack>
      <Alert icon={<FontAwesomeIcon icon="info" />}>
        <Text>
          Det kan hende prøver å booke intervjutid samtidig. Dette kan medføre
          at tidspunkter forsvinner om du ikke velger et tidspunkt raskt nok.
        </Text>
        <Text>
          For at vi ikke skal glemme å sette opp intervjuere er det tidligst
          mulig å booke et intervju neste dag.
        </Text>
      </Alert>
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
          onClick={() => {
            setDayOffset(dayOffset - 2)
          }}
        >
          -2 dager
        </Button>
        <Button
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
