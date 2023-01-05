import {
  Button,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { RetractApplicationModal } from '../RetractApplicationModal'

interface ApplicantSummaryProps {
  applicant: ApplicantNode
}

export const ApplicantSummary: React.FC<ApplicantSummaryProps> = ({
  applicant,
}) => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Stack>
      <Text size="md">Takk for at du har søkt KSG!</Text>
      <Title color={'dimmed'} order={3}>
        Intervjuinformasjon
      </Title>
      <Group>
        <Title order={4}>Hvor:</Title>
        <Text transform={'uppercase'} color={'samfundet-red'} weight={'bold'}>
          {applicant.interview?.location.name}
        </Text>
      </Group>
      <Stack>
        <Title order={4}>Beskrivelse:</Title>
        <Text>{applicant.interview?.location.locationDescription}</Text>
      </Stack>
      <Group>
        <Title order={4}>Når:</Title>
        <Text>
          {applicant.interview &&
            format(
              new Date(applicant.interview.interviewStart),
              "EEEE d. MMMM, 'kl' H:mm"
            )}
        </Text>
      </Group>
      <Title order={3}>Prioriteringer</Title>
      <List spacing={'xs'}>
        {applicant.priorities.map((priority, index) => {
          if (priority === null) {
            return null
          }
          return (
            <List.Item
              key={priority.id}
              icon={
                <ThemeIcon variant={'light'} size={24} radius={'md'}>
                  {index + 1}
                </ThemeIcon>
              }
            >
              {priority.internalGroupPosition.name}
            </List.Item>
          )
        })}
      </List>
      <Button
        variant={'outline'}
        color="samfundet-red"
        onClick={() => setModalOpen(true)}
      >
        Trekk søknad
      </Button>
      <Text>Du kan nå trygt lukke dette vinduet</Text>
      <RetractApplicationModal
        opened={modalOpen}
        setOpened={setModalOpen}
        applicant={applicant}
      />
    </Stack>
  )
}
