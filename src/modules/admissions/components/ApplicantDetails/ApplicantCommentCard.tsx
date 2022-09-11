import { Card, Group, Stack, Text } from '@mantine/core'
import { format } from 'date-fns/esm'
import { ApplicantCommentNode } from 'modules/admissions/types.graphql'
import { UserThumbnail } from 'modules/users'

interface ApplicantCommentCardProps {
  comment: ApplicantCommentNode
}

export const ApplicantCommentCard: React.VFC<ApplicantCommentCardProps> = ({
  comment,
}) => {
  const { user, text, createdAt } = comment
  return (
    <>
      <Card my="md">
        <Group align={'flex-start'}>
          <UserThumbnail user={user} />
          <Stack spacing={'xs'}>
            <Text>{user.fullName}</Text>
            <Text size="sm" color="gray">
              Skrevet {format(new Date(createdAt), 'dd. MMM yyyy hh:mm')}
            </Text>
          </Stack>
        </Group>
        <hr></hr>
        <Text>{text}</Text>
      </Card>
    </>
  )
}
