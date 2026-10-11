import { Affix, Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { PlaceProductOrder } from './PlaceProductOrder'

interface PlaceProductOrderButtonProps {
  sociSessionId: string
}

/**
 * Mobile only (hidden from the `sm` breakpoint). Floating button that opens
 * the order form in a modal, so the user does not scroll down a long
 * krysseliste. The modal stays open after a save, and the form keeps the user
 * and the product, to cross many orders in a row. Desktop keeps the inline form.
 */
export const PlaceProductOrderButton: React.FC<
  PlaceProductOrderButtonProps
> = ({ sociSessionId }) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal opened={opened} onClose={close} title="Legg til kryss" size="lg">
        <PlaceProductOrder sociSessionId={sociSessionId} />
      </Modal>
      <Affix hiddenFrom="sm" position={{ bottom: 24, right: 24 }}>
        <Button
          color="samfundet-red"
          size="md"
          radius="xl"
          leftSection={<IconPlus size={20} />}
          onClick={open}
        >
          Legg til kryss
        </Button>
      </Affix>
    </>
  )
}
