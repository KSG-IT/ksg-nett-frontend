import { Card, Divider, Group, SimpleGrid, Stack, Title } from '@mantine/core'
import { InternalGroupNode } from 'modules/organization/types'
import { UserThumbnail } from 'modules/users/components'

interface InternalGroupInfoProps {
  internalGroup: InternalGroupNode
}

export const InternalGroupInfo: React.FC<InternalGroupInfoProps> = ({
  internalGroup,
}) => {
  return (
    <SimpleGrid
      cols={2}
      breakpoints={[{ maxWidth: 900, cols: 1, spacing: 'sm' }]}
    >
      {internalGroup.description && (
        <Card p="sm" withBorder>
          <div
            dangerouslySetInnerHTML={{ __html: internalGroup.description }}
          />
        </Card>
      )}

      <Card p="sm" withBorder>
        <Title
          align={'center'}
          transform={'uppercase'}
          color={'gray.7'}
          order={3}
        >
          Gjengens medlemmer
        </Title>
        {internalGroup.membershipData.map(position => {
          if (position.users.length === 0) return null
          return (
            <Stack
              key={position.internalGroupPositionName}
              my={'sm'}
              spacing={'xs'}
            >
              <Title color={'dimmed'} order={4}>
                {position.internalGroupPositionName}
              </Title>
              <Group>
                <Card radius={'md'}>
                  <Group>
                    {position.users.map(user => (
                      <UserThumbnail key={user.id} user={user} size={'lg'} />
                    ))}
                  </Group>
                </Card>
              </Group>
              {internalGroup.membershipData.indexOf(position) !== 1 && (
                <Divider my={'sm'} />
              )}
            </Stack>
          )
        })}
      </Card>
    </SimpleGrid>
  )
}
