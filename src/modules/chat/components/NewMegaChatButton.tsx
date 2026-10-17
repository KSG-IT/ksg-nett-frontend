import { useQuery } from '@apollo/client'
import { Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useVisiblePolling } from 'util/hooks/useVisiblePolling'
import { MEGA_CHAT_PREVIEW_QUERY } from '../queries'
import { MegaChatPreviewReturns } from '../types.graphql'
import { NewMegaChatModal } from './NewMegaChatModal'

// The window opens at 18:00, so a page left open in the afternoon picks it up.
const PREVIEW_POLL_MS = 60_000

// A mega chat starts on Friday and Saturday evenings. The server says when
// the window is open; the button is hidden the rest of the week.
// Wrap it in a PermissionGate for chat.create_mega_chat.
export const NewMegaChatButton: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const query = useQuery<MegaChatPreviewReturns>(MEGA_CHAT_PREVIEW_QUERY)
  useVisiblePolling(query, PREVIEW_POLL_MS)

  const preview = query.data?.megaChatPreview
  if (!preview?.open) return null

  return (
    <>
      <Button leftSection={<IconPlus size={18} />} onClick={open}>
        Ny megachat
      </Button>
      <NewMegaChatModal opened={opened} onClose={close} preview={preview} />
    </>
  )
}
