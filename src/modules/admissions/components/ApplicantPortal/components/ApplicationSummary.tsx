import {
  Button,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { MessageBox } from 'components/MessageBox'
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
        <Title order={4}>Intervjulokale:</Title>
        {applicant.wantsDigitalInterview ? (
          <Text transform={'uppercase'} color={'samfundet-red'} weight={'bold'}>
            DIGITALT
          </Text>
        ) : (
          <Text transform={'uppercase'} color={'samfundet-red'} weight={'bold'}>
            {applicant.interview?.location.name}
          </Text>
        )}
      </Group>
      <Stack>
        <Title order={4}>Beskrivelse:</Title>
        {applicant.wantsDigitalInterview ? (
          <Text>
            Du vil bli tilsendt en lenke til en videsamtale ved intervjustart
          </Text>
        ) : (
          <Text>
            Møt opp i glassinngangen til Samfundet fem minutter før intervjuet
            starter. Vi ser frem til å møte deg!
          </Text>
        )}
      </Stack>
      <Group>
        <Title order={4}>Når:</Title>
        <Text>
          {applicant.interview &&
            format(
              new Date(applicant.interview.interviewStart),
              "EEEE d. MMMM, 'kl' HH:mm"
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
      <MessageBox type="info">
        Om du skulle lure på noe, eller ha andre problemer er det mulig å ta
        kontakt på
        <b> ksg-opptak@samfundet.no</b>
      </MessageBox>
      <Text>Du kan nå trygt lukke dette vinduet</Text>
      <RetractApplicationModal
        opened={modalOpen}
        setOpened={setModalOpen}
        applicant={applicant}
      />
    </Stack>
  )
}
