import { ActionIcon, Box, Button, Flex, Group, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
} from '@tabler/icons-react'
import { useState } from 'react'
import { useUserMutations } from '../../mutations.hooks'
import { MY_SETTINGS_QUERY } from '../../queries'
import { sameIds, splitTransferItems } from '../../transferList'
import { AllergyNode } from '../../types'
import { TransferBox } from './TransferBox'

interface AllergyTransferListProps {
  userAllergies: AllergyNode[]
  allAllergies: AllergyNode[]
}

// The user moves the allergies that apply to them from "Tilgjengelige" to
// "Mine allergier". The schedule allergy overview reads the saved list.
export const AllergyTransferList: React.FC<AllergyTransferListProps> = ({
  userAllergies,
  allAllergies,
}) => {
  const savedIds = userAllergies.map(allergy => allergy.id)
  const [selectedIds, setSelectedIds] = useState(savedIds)
  const [markedIds, setMarkedIds] = useState<string[]>([])

  const { updateMyAllergies, updateMyAllergiesLoading } = useUserMutations()

  const { available, selected } = splitTransferItems(allAllergies, selectedIds)
  const markedAvailable = available.filter(a => markedIds.includes(a.id))
  const markedSelected = selected.filter(a => markedIds.includes(a.id))
  const isDirty = !sameIds(selectedIds, savedIds)

  function handleToggle(id: string) {
    setMarkedIds(ids =>
      ids.includes(id) ? ids.filter(markedId => markedId !== id) : [...ids, id]
    )
  }

  function handleAdd() {
    const ids = markedAvailable.map(allergy => allergy.id)
    setSelectedIds(current => [...current, ...ids])
    setMarkedIds(current => current.filter(id => !ids.includes(id)))
  }

  function handleRemove() {
    const ids = markedSelected.map(allergy => allergy.id)
    setSelectedIds(current => current.filter(id => !ids.includes(id)))
    setMarkedIds(current => current.filter(id => !ids.includes(id)))
  }

  function handleSave() {
    updateMyAllergies({
      variables: { allergyIds: selectedIds },
      refetchQueries: [MY_SETTINGS_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Allergier oppdatert',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  return (
    <Stack>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap="sm"
        align={{ base: 'stretch', sm: 'center' }}
      >
        <TransferBox
          title="Tilgjengelige"
          items={available}
          markedIds={markedIds}
          onToggle={handleToggle}
          emptyText="Du har valgt alle"
        />
        <Flex
          direction={{ base: 'row', sm: 'column' }}
          gap="xs"
          justify="center"
        >
          <ActionIcon
            variant="default"
            size="lg"
            disabled={markedAvailable.length === 0}
            onClick={handleAdd}
            aria-label="Legg til markerte"
          >
            <Box component="span" lh={0} visibleFrom="sm">
              <IconChevronRight size={18} />
            </Box>
            <Box component="span" lh={0} hiddenFrom="sm">
              <IconChevronDown size={18} />
            </Box>
          </ActionIcon>
          <ActionIcon
            variant="default"
            size="lg"
            disabled={markedSelected.length === 0}
            onClick={handleRemove}
            aria-label="Fjern markerte"
          >
            <Box component="span" lh={0} visibleFrom="sm">
              <IconChevronLeft size={18} />
            </Box>
            <Box component="span" lh={0} hiddenFrom="sm">
              <IconChevronUp size={18} />
            </Box>
          </ActionIcon>
        </Flex>
        <TransferBox
          title="Mine allergier"
          items={selected}
          markedIds={markedIds}
          onToggle={handleToggle}
          emptyText="Ingen allergier valgt"
        />
      </Flex>
      <Group justify="flex-end">
        <Button
          disabled={!isDirty}
          loading={updateMyAllergiesLoading}
          onClick={handleSave}
        >
          Lagre
        </Button>
      </Group>
    </Stack>
  )
}
