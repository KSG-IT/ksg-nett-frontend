import { useQuery } from '@apollo/client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconChevronDown, IconChevronUp, IconTrash } from '@tabler/icons'
import { MessageBox } from 'components/MessageBox'
import { ApplicantStatusValues } from 'modules/admissions/consts'
import {
  useApplicantFromTokenMutations,
  usePatchApplicant,
} from 'modules/admissions/mutations.hooks'
import { INTERNAL_GROUP_POSITIONS_AVAILABLE_FOR_APPLICANTS_QUERY } from 'modules/admissions/queries'
import {
  ApplicantNode,
  InternalGroupPositionsAvailableForApplicantReturns,
} from 'modules/admissions/types.graphql'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface InternalGroupPosition {
  id: string
  name: string
}

interface SetPrioritiesProps {
  applicant: ApplicantNode
  nextStepCallback: () => void
}

export const SetPriorities: React.FC<SetPrioritiesProps> = ({
  applicant,
  nextStepCallback,
}) => {
  // === Local state variables ===
  // Initial priority state are applicant non-null priorities
  const { applicantToken } = useParams() as { applicantToken: string }
  const [animationParent] = useAutoAnimate<HTMLDivElement>()
  const [values, handlers] = useListState(
    applicant.priorities.filter(priority => priority !== null)
  )
  const [isDirty, setIsDirty] = useState(false)
  const [internalGroupPositions, setInternalGroupPositions] = useState<
    InternalGroupPosition[]
  >([])
  const [filteredInternalGroupPositions, setFilteredInternalGroupPositions] =
    useState<InternalGroupPosition[]>([])
  const { addPriority, updatePriorities, deleteInternalGroupPriority } =
    useApplicantFromTokenMutations()

  useEffect(() => {
    // We handle what internal group positions we want to display for the user
    const filteredPriorities = applicant.priorities.filter(
      priority => priority !== null
    )
    const priorityIds = filteredPriorities.map(
      priority => priority!.internalGroupPosition.id
    )
    const availableInternalGroupPositions = internalGroupPositions.filter(
      position => !priorityIds.includes(position.id)
    )
    handlers.setState(filteredPriorities)
    // Filtered positions are those which are available for the user to add to their priority listing
    setFilteredInternalGroupPositions(availableInternalGroupPositions)
  }, [internalGroupPositions, applicant.priorities])

  useEffect(() => {
    const filteredPriorities = values.filter(priority => priority !== null)
    const priorityIds = filteredPriorities.map(
      priority => priority!.internalGroupPosition.id
    )
    handleUpdatePriorities(priorityIds)
    setIsDirty(false)
  }, [isDirty])

  // === Queries and mutations ===
  useQuery<InternalGroupPositionsAvailableForApplicantReturns>(
    INTERNAL_GROUP_POSITIONS_AVAILABLE_FOR_APPLICANTS_QUERY,
    {
      onCompleted(data) {
        const { internalGroupPositionsAvailableForApplicants } = data
        setInternalGroupPositions(internalGroupPositionsAvailableForApplicants)
      },
    }
  )

  // Saves priorities and moves the applicant to the interview booking phase
  const { patchApplicant } = usePatchApplicant()

  //  === Handlers ===
  const handleAddPriority = (internal_group_position_id: string) => {
    addPriority({
      variables: {
        internalGroupPositionId: internal_group_position_id,
        token: applicantToken,
      },
    })
  }

  const handlePriorityChange = (index: number, direction: -1 | 1) => {
    handlers.reorder({ from: index, to: index + direction })
    setIsDirty(true)
  }
  const handleUpdatePriorities = (priorityIds: string[]) => {
    updatePriorities({
      variables: {
        priorityOrder: priorityIds,
        applicantId: applicant.id,
        token: applicantToken,
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

  const handleDeletePriority = (internal_group_position_id: string) => {
    deleteInternalGroupPriority({
      variables: {
        internalGroupPositionId: internal_group_position_id,
        token: applicantToken,
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

  const handleNextStep = () => {
    if (confirm('Bekreft at du vil gå videre til neste steg')) {
      patchApplicant({
        variables: {
          id: applicant.id,
          input: {
            status: ApplicantStatusValues.HAS_SET_PRIORITIES,
          },
        },
        refetchQueries: ['GetApplicantFromToken'],
        onCompleted() {
          showNotification({
            title: 'Lagret prioriteringer',
            message: 'Du har nå lagret dine prioriteringer',
          })
          nextStepCallback()
        },
        onError() {
          showNotification({
            title: 'Kunne ikke lagre prioriteringer',
            message: 'Noe gikk galt under lagring av prioriteringer',
          })
        },
      })
    }
  }

  // ToDo move this to local state and update in useEffect
  const canMoveOn = values.length > 0
  const canAddPriority = values.length < 3

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
    <Stack style={{ maxWidth: 900 }}>
      <MessageBox type="info">
        Du må minst ha 1 stilling før du kan booke intervju, og kan ikke ha mer
        enn 3. Du kan lese mer om de forskjellige stillingene på{' '}
        <Anchor
          href={'https://samfundet.no/informasjon/kafe-og-serveringsgjengen'}
          target={'_blank'}
        >
          <b>denne lenken</b>
        </Anchor>
        .
      </MessageBox>
      <MessageBox type="danger">
        Du må minst være fylt 20 år for å søke på spritbartender eller
        barservitør. Selv om de er tilgjengelige her.
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
              <Button
                color="samfundet-red"
                variant={'outline'}
                leftIcon={<IconTrash />}
                onClick={() => {
                  handleDeletePriority(priority!.internalGroupPosition.id)
                }}
              >
                Fjern
              </Button>
            </Group>
          </Group>
        ))}
      </Stack>
      <Divider />
      <Stack>
        <Title color={'dimmed'} order={3}>
          Tilgjengelige stillinger
        </Title>
        <SimpleGrid breakpoints={[{ minWidth: 'sm', cols: 4 }]} cols={1}>
          {filteredInternalGroupPositions.map(position => (
            <Button
              key={position.name}
              variant={'light'}
              color="samfundet-red"
              onClick={() => {
                handleAddPriority(position.id)
              }}
              disabled={!canAddPriority}
            >
              {position.name}
            </Button>
          ))}
        </SimpleGrid>
      </Stack>
      <MessageBox type="warning">
        <b>Obs!</b> Selv om du har mulighet til å velge mer enn 3 prioriteringer
        på Samfundet sine nettssider når du søker KSG ber vi deg begrense deg
        til 3 prioriteringer her. Du vil ikke ha mulighet til å endre på
        stillingene etter at du har lagret på denne siden. Det er mulig å endre
        rekkefølgen på prioriteringene dine under intervjuet.
      </MessageBox>

      <Button
        onClick={handleNextStep}
        disabled={!canMoveOn}
        color="samfundet-red"
      >
        Lagre prioriteringer
      </Button>
    </Stack>
  )
}
