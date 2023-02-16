import { Avatar, Badge, Divider, Group, Title } from '@mantine/core'
import { useEditor } from '@tiptap/react'
import { UserThumbnail } from '../../users/components'
import { SummaryNode } from '../types'

interface SummaryProps {
  summary: SummaryNode
}

export const Summary: React.FC<SummaryProps> = ({ summary }: SummaryProps) => {
  return (
    <>
      <Group position={'left'}>
        <Badge variant={'filled'} size={'lg'}>
          {summary.displayName}
        </Badge>
        <Divider orientation={'vertical'} />
        <Group>
          <Title weight={'normal'} order={4} color={'dark'}>
            Referent
          </Title>

          <UserThumbnail user={summary.reporter} size="md" />
        </Group>
        <Divider orientation={'vertical'} />
        <Group>
          <Title weight={'normal'} order={4} color={'dark'}>
            Deltakere
          </Title>

          <Avatar.Group>
            {summary.participants.map((user, i) => (
              <UserThumbnail user={user} size="md" key={i} />
            ))}
          </Avatar.Group>
        </Group>
      </Group>
      <Divider size={1} />
      <div dangerouslySetInnerHTML={{ __html: summary.contents }} />
    </>
  )
}
