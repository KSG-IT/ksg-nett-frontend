import { Avatar, Badge, Divider, Group, Title } from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { UserThumbnail } from '../../users/components'
import { SummaryNode } from '../types'
import { getSummaryTypeLabel } from '../util'

interface SummaryProps {
  summary: SummaryNode
}

export const Summary: React.FC<SummaryProps> = ({ summary }: SummaryProps) => {
  return (
    <>
      <Group position={'left'}>
        <Badge variant={'filled'} size={'lg'} color={'samfundet-red'}>
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

      <ReactMarkdown plugins={[remarkGfm]}>{summary.contents}</ReactMarkdown>
    </>
  )
}
