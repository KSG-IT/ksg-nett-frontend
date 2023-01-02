import {
  Button,
  Container,
  Group,
  Stack,
  Title,
  Text,
  SimpleGrid,
  Divider,
} from '@mantine/core'
import { AvailableInterviewsDayGrouping } from 'modules/admissions/types.graphql'

import { format } from 'util/date-fns'

export interface InterviewsAvailableProps {
  interviews: AvailableInterviewsDayGrouping[]
  handleCallback: (interviewIds: string[]) => void
}

export const InterviewsAvailableForBooking: React.FC<
  InterviewsAvailableProps
> = ({ interviews, handleCallback }) => {
  if (interviews.length === 0) {
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
      <Title color={'dimmed'} order={3}>
        Tilgjengelige tidspunkter
      </Title>
      <Divider my={'xs'} />
      {interviews.map(interviewDay => (
        <Stack key={`${interviewDay.date}`}>
          <Title order={5} transform={'uppercase'}>
            {format(new Date(interviewDay.date), 'EEEE dd MMM')}
          </Title>
          <SimpleGrid
            cols={6}
            breakpoints={[{ maxWidth: 600, cols: 1, spacing: 'sm' }]}
          >
            {interviewDay.interviewSlots.map((slot, i) => {
              const unavailable = slot.interviewIds.length === 0
              return (
                <Button
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
      <Divider my={'xs'} />
    </>
  )
}
