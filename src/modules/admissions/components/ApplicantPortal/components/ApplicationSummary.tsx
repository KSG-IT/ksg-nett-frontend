import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { MessageBox } from 'components/MessageBox'
import { useApplicantFromTokenMutations } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'util/date-fns'
import { RetractApplicationModal } from '../RetractApplicationModal'

interface ApplicantSummaryProps {
  applicant: ApplicantNode
}

export const ApplicantSummary: React.FC<ApplicantSummaryProps> = ({
  applicant,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { applicantToken } = useParams() as { applicantToken: string }
  const [isDirty, setIsDirty] = useState(false)

  const { updatePriorities } = useApplicantFromTokenMutations()

  const [animationParent] = useAutoAnimate<HTMLDivElement>()
  const [values, handlers] = useListState(
    applicant.priorities.filter(priority => priority !== null)
  )

  function handleUpdatePriorities(priorityIds: string[]) {
    updatePriorities({
      variables: {
        priorityOrder: priorityIds,
        applicantId: applicant.id,
        token: applicantToken,
      },
      onCompleted() {
        setIsDirty(false)
        showNotification({
          title: 'Suksess!',
          message: 'Prioriteringene dine er oppdatert.',
          color: 'teal',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Error',
          message,
          color: 'red',
        })
      },
    })
  }

  const handlePriorityChange = (index: number, direction: -1 | 1) => {
    handlers.reorder({ from: index, to: index + direction })
    setIsDirty(true)
  }

  function renderChangePriorityButtons(index: number) {
    const moveUp = index > 0
    const moveDown = index < values.length - 1

    return (
      <Stack spacing={0}>
        <ActionIcon
          disabled={!moveUp}
          onClick={() => handlePriorityChange(index, -1)}
        >
          <IconChevronUp />
        </ActionIcon>

        <ActionIcon
          disabled={!moveDown}
          onClick={() => handlePriorityChange(index, 1)}
        >
          <IconChevronDown />
        </ActionIcon>
      </Stack>
    )
  }

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
      <MessageBox type="warning">
        Du har mulighet til å omprioritere fram til intervjuperioden er over
      </MessageBox>

      <Stack ref={animationParent}>
        {values.map((priority, index) => (
          <Group grow key={priority!.id} position={'apart'}>
            <Text>
              <ThemeIcon mr={'sm'} radius={'md'}>
                {index + 1}
              </ThemeIcon>{' '}
              {priority?.internalGroupPosition.name}
            </Text>
            <Group position={'right'}>
              {renderChangePriorityButtons(index)}
            </Group>
          </Group>
        ))}
        <Button
          disabled={!isDirty}
          onClick={() =>
            handleUpdatePriorities(
              values
                .filter(prio => prio !== null)
                .map(prio => prio!.internalGroupPosition.id)
            )
          }
        >
          Oppdater prioriteringer
        </Button>
      </Stack>

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
