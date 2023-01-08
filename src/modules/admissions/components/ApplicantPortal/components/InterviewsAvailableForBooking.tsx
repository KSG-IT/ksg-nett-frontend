import {
  Button,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { InterviewsAvailableForBookingReturns } from 'modules/admissions/types.graphql'

import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY } from 'modules/admissions/queries'
import { format } from 'util/date-fns'

export interface InterviewsAvailableProps {
  dateSelected: string
  handleCallback: (value: string[]) => void
  currentlySelected: string[]
}

export const InterviewsAvailableForBooking: React.FC<
  InterviewsAvailableProps
> = ({ dateSelected, handleCallback, currentlySelected }) => {
  const { data, error, loading } =
    useQuery<InterviewsAvailableForBookingReturns>(
      INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY,
      {
        pollInterval: 5_000,
        fetchPolicy: 'network-only',
        variables: {
          dateSelected: dateSelected,
        },
      }
    )

  if (error) return <FullPageError />

  if (loading || !data)
    return (
      <Container style={{ minHeight: '600px' }}>
        <FullContentLoader />
      </Container>
    )

  if (data.interviewsAvailableForBooking.length === 0) {
    return (
      <Container>
        <Title order={3}>Ingen intervjuer tilgjengelig</Title>
        <Text>
          Det er ingen intervjuer tilgjengelig for booking. Prøv igjen senere
          eller sjekk andre dager.
        </Text>
      </Container>
    )
  }
  return (
    <>
      {data.interviewsAvailableForBooking.map(interviewDay => (
        <Stack key={`${interviewDay.date}`}>
          <Title color={'dimmed'} order={3}>
            Tilgjengelige tidspunkter
          </Title>
          <Title order={5} transform={'uppercase'}>
            {format(new Date(interviewDay.date), 'EEEE dd MMM')}
          </Title>
          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: 600, cols: 1, spacing: 'sm' }]}
          >
            {interviewDay.interviewSlots.map((slot, i) => {
              const unavailable = slot.interviewIds.length === 0
              return (
                <Button
                  variant={
                    currentlySelected === slot.interviewIds
                      ? 'filled'
                      : 'outline'
                  }
                  radius={'md'}
                  key={i}
                  disabled={unavailable}
                  onClick={() => {
                    handleCallback(slot.interviewIds)
                  }}
                >
                  {format(new Date(slot.interviewStart), 'HH:mm')}
                </Button>
              )
            })}
          </SimpleGrid>
        </Stack>
      ))}
    </>
  )
}
