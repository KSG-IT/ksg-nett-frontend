import {
  ActionIcon,
  Badge,
  Card,
  createStyles,
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
import { IconNotes, IconPlus } from '@tabler/icons-react'
import { useIsMobile } from 'util/hooks'
import { PermissionGate } from 'components/PermissionGate'
import { PERMISSIONS } from 'util/permissions'

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
        cols={3}
        p={isMobile ? 0 : 'md'}
        spacing={isMobile ? 0 : 'lg'}
        verticalSpacing={isMobile ? 'lg' : 'xl'}
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
            <Group grow position={'apart'} mt="md" mb="xs">
              <Text weight={700}>{highlight.user.getFullWithNickName}</Text>
              <Group position={'right'} spacing={0}>
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
              <Text size={'sm'} color={'dimmed'}>
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
          <Title
            align={'center'}
            order={4}
            color={'dimmed'}
            transform={'uppercase'}
          >
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

const useStyles = createStyles(theme => ({
  addButton: {
    width: '100%',
    backgroundColor: theme.colors.gray[2],
    borderRadius: theme.radius.lg,
    border: '1px solid ' + theme.colors.gray[3],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.colors.gray[5],
  },
}))
