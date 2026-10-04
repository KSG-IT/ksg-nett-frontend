import {
  Button,
  CopyButton,
  Group,
  Popover,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { IconCalendarPlus } from '@tabler/icons-react'
import { API_URL } from 'util/env'

interface CalendarSubscribeButtonProps {
  icalToken: string
  compact?: boolean
}

// The iCal feed has the user's shifts and the interviews they attend
// (ksg-nett-backend/schedules/views.py). A calendar that subscribes to the
// address updates by itself.
export const CalendarSubscribeButton: React.FC<
  CalendarSubscribeButtonProps
> = ({ icalToken, compact = false }) => {
  const url = `${API_URL}/schedules/${icalToken}`

  return (
    <Popover position="bottom-end" width={340} withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="default"
          leftSection={<IconCalendarPlus size={16} />}
          aria-label="Legg til i kalender"
        >
          {compact ? 'Kalender' : 'Legg til i kalender'}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Text fw={600} size="sm">
            Abonner på vaktene dine
          </Text>
          <Text size="xs" c="dimmed">
            Legg til adressen som et abonnement i Google, Apple eller Outlook
            kalender. Kalenderen oppdaterer seg selv.
          </Text>
          <Group gap="xs" wrap="nowrap">
            <TextInput
              value={url}
              readOnly
              size="xs"
              style={{ flex: 1 }}
              aria-label="Kalenderadresse"
            />
            <CopyButton value={url}>
              {({ copied, copy }) => (
                <Button
                  size="xs"
                  color={copied ? 'teal' : undefined}
                  onClick={copy}
                >
                  {copied ? 'Kopiert' : 'Kopier'}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
