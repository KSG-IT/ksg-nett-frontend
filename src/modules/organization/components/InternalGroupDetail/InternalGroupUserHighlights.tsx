import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Spoiler,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useQuery } from '@apollo/client'
import { INTERNAL_GROUP_USER_HIGHLIGHTS_BY_INTERNAL_GROUP_QUERY } from '../../queries'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  InternalGroupUserHighlightNode,
  InternalGroupUserHighlightsByInternalGroupReturns,
  InternalGroupUserHighlightsByInternalGroupVariables,
} from '../../types'
import { InternalGroupUserHighlightEditForm } from 'modules/organization/components/InternalGroupDetail/components/EditHighlights/InternalGroupUserHighlightEditForm'
import { useState } from 'react'
import { IconNotes } from '@tabler/icons'

interface InternalGroupUserHighlightsProps {
  internalGroupId: string
}

export const InternalGroupUserHighlights: React.FC<
  InternalGroupUserHighlightsProps
> = ({ internalGroupId }) => {
  const { data, loading, error } = useQuery<
    InternalGroupUserHighlightsByInternalGroupReturns,
    InternalGroupUserHighlightsByInternalGroupVariables
  >(INTERNAL_GROUP_USER_HIGHLIGHTS_BY_INTERNAL_GROUP_QUERY, {
    variables: { internalGroupId: internalGroupId },
  })
  const [modalOpened, setModalOpened] = useState(false)
  const [selectedHighlight, setSelectedHighlight] =
    useState<InternalGroupUserHighlightNode | null>(null)
  const theme = useMantineTheme()
  if (error || !data) return <FullPageError />
  if (loading) return <FullContentLoader />

  const { internalGroupUserHighlightsByInternalGroup: highlightData } = data
  return (
    <SimpleGrid
      cols={3}
      p={'xl'}
      breakpoints={[
        { maxWidth: 900, cols: 1, spacing: 'sm' },
        { maxWidth: 1200, cols: 2, spacing: 'sm' },
      ]}
    >
      {highlightData.map(highlight => (
        <Card key={highlight.id} withBorder radius={'lg'}>
          <Card.Section>
            {highlight.image && (
              <Image src={highlight.image.toString()} height={300} />
            )}
          </Card.Section>
          <Group position={'apart'} mt="md" mb="xs">
            <Text weight={700}>{highlight.user.firstName}</Text>
            <Group>
              <Badge>{highlight.occupation}</Badge>
              <ActionIcon
                onClick={() => {
                  setModalOpened(true)
                  setSelectedHighlight(highlight)
                }}
              >
                <IconNotes />
              </ActionIcon>
            </Group>
          </Group>
          <Spoiler maxHeight={120} showLabel={'Vis mer'} hideLabel="Hide">
            <Text size={'sm'} color={'dimmed'}>
              {highlight.description}
            </Text>
          </Spoiler>
          <Modal
            size={'lg'}
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            overlayColor={theme.colors.gray[2]}
            overlayOpacity={0.55}
            overlayBlur={3}
          >
            <Title mb={'sm'} order={4} color={'dimmed'}>
              Rediger din funk
            </Title>
            {selectedHighlight && (
              <InternalGroupUserHighlightEditForm
                highlight={selectedHighlight}
                onCompletedCallback={() => setModalOpened(false)}
              />
            )}
          </Modal>
        </Card>
      ))}
    </SimpleGrid>
  )
}
