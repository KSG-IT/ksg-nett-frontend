import { useQuery } from '@apollo/client'
import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Spoiler,
  Stack,
  Switch,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { IconNotes, IconPlus } from '@tabler/icons-react'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { InternalGroupUserHighlightEditForm } from 'modules/organization/components/InternalGroupDetail/components/EditHighlights/InternalGroupUserHighlightEditForm'
import { useState } from 'react'
import { useIsMobile } from 'util/hooks'
import { PERMISSIONS } from 'util/permissions'
import { INTERNAL_GROUP_USER_HIGHLIGHTS_BY_INTERNAL_GROUP_QUERY } from '../../queries'
import {
  InternalGroupUserHighlightNode,
  InternalGroupUserHighlightsByInternalGroupReturns,
  InternalGroupUserHighlightsByInternalGroupVariables,
} from '../../types'

interface InternalGroupUserHighlightsProps {
  internalGroupId: string
}

export const InternalGroupUserHighlights: React.FC<
  InternalGroupUserHighlightsProps
> = ({ internalGroupId }) => {
  const [includeArchived, setIncludeArchived] = useState(false)
  const { data, loading, error } = useQuery<
    InternalGroupUserHighlightsByInternalGroupReturns,
    InternalGroupUserHighlightsByInternalGroupVariables
  >(INTERNAL_GROUP_USER_HIGHLIGHTS_BY_INTERNAL_GROUP_QUERY, {
    variables: { internalGroupId: internalGroupId, includeArchived },
  })
  const [modalOpened, setModalOpened] = useState(false)
  const [selectedHighlight, setSelectedHighlight] = useState<
    InternalGroupUserHighlightNode | undefined
  >(undefined)
  const isMobile = useIsMobile()
  const { classes } = useStyles()
  if (error) return <FullPageError />
  if (loading || !data) return <FullContentLoader />

  const { internalGroupUserHighlightsByInternalGroup: highlightData } = data
  return (
    <Stack>
      <Switch
        label="Inkludert arkiverte"
        checked={includeArchived}
        onChange={() => setIncludeArchived(prev => !prev)}
      />
      <SimpleGrid
        cols={{ base: 1, md: 2, lg: 3 }}
        p={isMobile ? 0 : 'md'}
        spacing={isMobile ? 0 : 'lg'}
        verticalSpacing={isMobile ? 'lg' : 'xl'}
      >
        {highlightData.map(highlight => (
          <Card key={highlight.id} withBorder radius={'lg'}>
            <Card.Section>
              {highlight.image && (
                <Image src={highlight.image.toString()} height={300} />
              )}
            </Card.Section>
            <Group grow justify={'space-between'} mt="md" mb="xs">
              <Text fw={700}>{highlight.user.getFullWithNickName}</Text>
              <Group justify={'flex-end'} gap={0}>
                <Badge>{highlight.occupation}</Badge>
                <PermissionGate
                  permissions={
                    PERMISSIONS.organization.change.internalGroupUserHighlight
                  }
                >
                  <ActionIcon
                    onClick={() => {
                      setModalOpened(true)
                      setSelectedHighlight(highlight)
                    }}
                  >
                    <IconNotes />
                  </ActionIcon>
                </PermissionGate>
              </Group>
            </Group>
            <Spoiler maxHeight={120} showLabel={'Vis mer'} hideLabel="Hide">
              <Text size={'sm'} c={'dimmed'}>
                {highlight.description}
              </Text>
            </Spoiler>
          </Card>
        ))}

        <Modal
          size={'lg'}
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
        >
          <Title ta={'center'} order={4} c={'dimmed'} tt={'uppercase'}>
            Rediger/legg til høydepunkt
          </Title>
          <Divider my={'md'} />

          <InternalGroupUserHighlightEditForm
            highlight={selectedHighlight}
            onCompletedCallback={() => {
              setModalOpened(false)
            }}
          />
        </Modal>

        <UnstyledButton
          p={'xl'}
          className={classes.addButton}
          onClick={() => {
            setSelectedHighlight(undefined)
            setModalOpened(true)
          }}
        >
          <IconPlus size={30} />
        </UnstyledButton>
      </SimpleGrid>
    </Stack>
  )
}

const useStyles = createStyles({
  addButton: {
    width: '100%',
    backgroundColor: 'var(--mantine-color-gray-2)',
    borderRadius: 'var(--mantine-radius-lg)',
    border: '1px solid var(--mantine-color-gray-3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--mantine-color-gray-5)',
  },
})
