import {
  Button,
  createStyles,
  Group,
  Modal,
  Select,
  TextInput,
  NumberInput,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { format } from 'util/date-fns'
import { useSociSessionMutations } from 'modules/economy/mutations.hooks'
import { ALL_SOCI_SESSIONS } from 'modules/economy/queries'
import { SociSessionType } from 'modules/economy/types.graphql'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showNotification } from '@mantine/notifications'

interface CreateSociSessionModalProps {
  open: boolean
  onCloseCallback: () => void
}

export const CreateSociSessionModal: React.FC<CreateSociSessionModalProps> = ({
  open,
  onCloseCallback,
}) => {
  const { classes } = useStyles()
  const [name, setName] = useState('')
  const [minimumRemainingBalance, setMinimumRemainingBalance] = useState(0)
  const [type, setType] = useState<SociSessionType>(SociSessionType.KRYSSELISTE)
  const [date, setDate] = useState(new Date())
  const navigate = useNavigate()

  const { createSociSession } = useSociSessionMutations()

  function handleSubmit() {
    type Input = {
      name: string | null
      minimumRemainingBalance: number
      type: SociSessionType
      creationDate: string
    }
    const input: Input = {
      name: name.trim(),
      minimumRemainingBalance: minimumRemainingBalance,
      type,
      creationDate: format(date, 'yyyy-MM-dd'),
    }

    if (type === SociSessionType.STILLETIME) {
      input.name = null
    }

    if (name.trim() === '') return

    createSociSession({
      variables: {
        input,
      },
      refetchQueries: [ALL_SOCI_SESSIONS],
      onCompleted({ createSociSession: { sociSession } }) {
        onCloseCallback()

        showNotification({
          title: 'Suksess',
          message: 'krysseliste opprettet',
        })
        navigate(`${sociSession.id}`)
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  function handleCancel() {
    onCloseCallback()
  }

  return (
    <Modal opened={open} onClose={onCloseCallback} title="Ny innkryssing">
      <div className={classes.form}>
        <TextInput
          label="Navn på liste"
          value={name}
          onChange={evt => setName(evt.currentTarget.value)}
        />
        <DatePicker
          label="Dato for innkryssing"
          value={date}
          onChange={val => val && setDate(val)}
        />
        <Select
          label="Listetype"
          clearable={false}
          value={type}
          data={[
            {
              label: SociSessionType.KRYSSELISTE,
              value: SociSessionType.KRYSSELISTE,
            },
          ]}
          onChange={val => val && setType(val as SociSessionType)}
        />
        <NumberInput
          label="Minstebeløp gjenværende saldo"
          value={minimumRemainingBalance}
          // min={0}
          onChange={val => val && setMinimumRemainingBalance(val)}
        />
        <Group position="right">
          <Button color="gray" onClick={handleCancel}>
            Avbryt
          </Button>
          <Button color="samfundet-red" type="submit" onClick={handleSubmit}>
            Opprett
          </Button>
        </Group>
      </div>
    </Modal>
  )
}

const useStyles = createStyles(theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
}))
