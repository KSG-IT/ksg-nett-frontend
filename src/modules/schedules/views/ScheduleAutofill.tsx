import { ActionIcon, Button, Group, Stack, Text, Title } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconBackhoe } from '@tabler/icons-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'util/date-fns'

interface ScheduleAutofillParams {
  id: string
}

function fetchMockData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data')
    }, 2000)
  })
}

const ScheduleAutofill = () => {
  const [loading, setLoading] = useState(false)
  const { id } = useParams<
    keyof ScheduleAutofillParams
  >() as ScheduleAutofillParams

  function handleAutofill() {
    setLoading(true)
    fetchMockData().finally(() => setLoading(false))
  }

  return (
    <Stack>
      <DatePickerInput label="Fra" />
      <DatePickerInput label="Til" />
      <Button loading={loading} onClick={handleAutofill}>
        Gjør jobben min!
      </Button>

      <Stack>
        <Title>Kjøringer</Title>
        <Group>
          <Text>{format(new Date(), 'dd MMM HH:mm:ss')}</Text>
          <Text>Kjøring 4</Text>
          <ActionIcon>
            <IconBackhoe stroke="blue" />
          </ActionIcon>
        </Group>
        <Group>
          <Text>{format(new Date(), 'dd MMM HH:mm:ss')}</Text>
          <Text>Kjøring 3</Text>
          <ActionIcon>
            <IconBackhoe stroke="blue" />
          </ActionIcon>
        </Group>
        <Group>
          <Text>{format(new Date(), 'dd MMM HH:mm:ss')}</Text>
          <Text>Kjøring 2</Text>
          <ActionIcon>
            <IconBackhoe stroke="blue" />
          </ActionIcon>
        </Group>
        <Group>
          <Text>{format(new Date(), 'dd MMM HH:mm:ss')}</Text>
          <Text>Kjøring 1</Text>
          <ActionIcon>
            <IconBackhoe stroke="blue" />
          </ActionIcon>
        </Group>
      </Stack>
    </Stack>
  )
}

export default ScheduleAutofill
