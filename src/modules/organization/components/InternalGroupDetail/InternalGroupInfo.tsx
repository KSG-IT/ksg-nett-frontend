import { Card, Group, Stack, Text, Title } from '@mantine/core'
import { InternalGroupNode } from 'modules/organization/types'
import { UserThumbnail } from 'modules/users/components'

interface InternalGroupInfoProps {
  internalGroup: InternalGroupNode
}

export const InternalGroupInfo: React.FC<InternalGroupInfoProps> = ({
  internalGroup,
}) => {
  return (
    <Stack>
      {internalGroup.description && (
        <Card p="sm">
          <div
            dangerouslySetInnerHTML={{ __html: internalGroup.description }}
          />
        </Card>
      )}

      {internalGroup.membershipData.map(position => {
        if (position.users.length === 0) return null
        return (
          <>
            <Title order={3}>{position.internalGroupPositionName}</Title>
            <Group>
              {position.users.map(user => (
                <Stack>
                  <UserThumbnail user={user} />
                  <Text>{user.fullName}</Text>
                </Stack>
              ))}
            </Group>
          </>
        )
      })}
    </Stack>
  )
}
