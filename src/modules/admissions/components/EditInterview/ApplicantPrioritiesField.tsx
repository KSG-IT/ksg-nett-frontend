import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  Button,
  createStyles,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconCaretDown, IconCaretUp } from '@tabler/icons'
import { MessageBox } from 'components/MessageBox'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import {
  APPLICANT_QUERY,
  INTERVIEW_DETAIL_QUERY,
} from 'modules/admissions/queries'
import {
  ApplicantNode,
  InternalGroupPositionPriority,
} from 'modules/admissions/types.graphql'
import { useState } from 'react'

interface ApplicantPrioritiesFieldProps {
  applicant: Pick<ApplicantNode, 'id' | 'priorities'>
}

export const ApplicantPrioritiesField: React.FC<
  ApplicantPrioritiesFieldProps
> = ({ applicant }) => {
  const [priorities, setPriorities] = useState(
    applicant.priorities.filter(priority => priority !== null)
  )
  const [values, handlers] = useListState(priorities)
  const [animationParent] = useAutoAnimate<HTMLUListElement>()
  const [isDirty, setIsDirty] = useState(false)
  const { classes } = useStyles()

  const {
    updateInternalGroupPositionPriorityOrder,
    updateInternalGroupPositionPriorityOrderLoading,
    deleteInternalGroupPositionPriority,
  } = useApplicantMutations()

  function renderChangePriorityButtons(index: number) {
    const moveUp = index > 0
    const moveDown = index < 2

    return (
      <span>
        <UnstyledButton
          disabled={!moveUp}
          onClick={() => handlePriorityChange(index, -1)}
        >
          <IconCaretUp />
        </UnstyledButton>

        <UnstyledButton
          disabled={!moveDown}
          onClick={() => handlePriorityChange(index, 1)}
        >
          <IconCaretDown />
        </UnstyledButton>
      </span>
    )
  }

  function handleDeletePriority(priority: InternalGroupPositionPriority) {
    // Not stable API endpoint yet
    const confirmed = confirm(
      `Sikker på at du vil slette ${priority?.internalGroupPosition.name}?`
    )
    if (!confirmed || !priority) return

    deleteInternalGroupPositionPriority({
      variables: {
        id: priority.id,
      },
      refetchQueries: [INTERVIEW_DETAIL_QUERY, APPLICANT_QUERY],
      onCompleted() {
        showNotification({
          title: 'Prioritet slettet',
          message: `${priority.internalGroupPosition.name} ble slettet fra listen`,
          color: 'green',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }

  function handlePriorityChange(index: number, direction: -1 | 1) {
    handlers.reorder({ from: index, to: index + direction })
    setIsDirty(true)
  }

  function handleUpdatePriorities() {
    const priorityOrder = values.map(
      priority => priority!.internalGroupPosition.id
    )

    updateInternalGroupPositionPriorityOrder({
      variables: {
        applicantId: applicant.id,
        priorityOrder: priorityOrder,
      },
      onCompleted() {
        showNotification({
          title: 'Prioriteter oppdatert',
          message: 'Kandidaten har fått oppdatert prioriteringene sine',
          color: 'teal',
        })
        setIsDirty(false)
      },
      onError({ message }) {
        showNotification({
          title: 'Klarte ikke oppdatere prioriteter',
          message,
        })
      },
    })
  }

  return (
    <Stack>
      <Text size="lg" weight="bold">
        Kandidat prioriteringer
      </Text>
      <MessageBox type="warning">
        Husk å lagre endringer til prioriteringer!
      </MessageBox>
      <ul className={classes.priorityContainer} ref={animationParent}>
        {values.map((priority, index) => (
          <li className={classes.priorityCard} key={priority!.id}>
            <span>{priority?.internalGroupPosition.name}</span>
            {renderChangePriorityButtons(index)}
          </li>
        ))}
      </ul>
      <Button
        disabled={!isDirty}
        loading={updateInternalGroupPositionPriorityOrderLoading}
        onClick={handleUpdatePriorities}
      >
        Oppdater prioriteter
      </Button>
    </Stack>
  )
}

const useStyles = createStyles(t => ({
  priorityContainer: {
    margin: 0,
    padding: 0,
  },
  priorityCard: {
    width: 400,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    listStyle: 'none',
    backgroundColor: t.white,
    boxShadow: t.shadows.sm,
    borderRadius: t.radius.sm,
    padding: t.spacing.sm,
    margin: '0.5rem',
  },
}))
