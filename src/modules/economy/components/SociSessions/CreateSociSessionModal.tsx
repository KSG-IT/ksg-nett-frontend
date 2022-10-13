import {
  Button,
  createStyles,
  Group,
  Modal,
  Select,
  TextInput,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { format } from 'util/date-fns'
import { useSociSessionMutations } from 'modules/economy/mutations.hooks'
import { ALL_SOCI_SESSIONS } from 'modules/economy/queries'
import { SociSessionType } from 'modules/economy/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

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
  const [type, setType] = useState<SociSessionType>(SociSessionType.STILLETIME)
  const [date, setDate] = useState(new Date())
  const navigate = useNavigate()

  const { createSociSession } = useSociSessionMutations()

  function handleSubmit() {
    if (name === '') {
      return
    }
    createSociSession({
      variables: {
        input: {
          name,
          type,
          creationDate: format(date, 'yyyy-MM-dd'),
        },
      },
      refetchQueries: [ALL_SOCI_SESSIONS],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted({ sociSession }) {
        onCloseCallback()
        toast.success('Liste opprettet')
        navigate(`/soci-session/${sociSession.id}`)
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
          label="Listeytype"
          clearable={false}
          data={[
            {
              label: SociSessionType.KRYSSELISTE,
              value: SociSessionType.KRYSSELISTE,
            },
            {
              label: SociSessionType.STILLETIME,
              value: SociSessionType.STILLETIME,
            },
          ]}
          onChange={val => val && setType(val as SociSessionType)}
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
