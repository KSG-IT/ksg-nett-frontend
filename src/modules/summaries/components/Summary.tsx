import { Avatar, Divider, Group, Title } from '@mantine/core'
import { Badge } from 'components/Badge'
import { RichTextContent } from 'components/RichTextEditor'
import { ReceiptStats } from './ReceiptStats'
import { UserThumbnail } from '../../users/components'
import { SummaryNode } from '../types'

interface SummaryProps {
  summary: SummaryNode
}

export const Summary: React.FC<SummaryProps> = ({ summary }: SummaryProps) => {
  return (
    <>
      <Group>
        <Badge variant={'filled'} size={'lg'} color={'samfundet-red'}>
          {summary.displayName}
        </Badge>
        <Divider orientation={'vertical'} />
        <Group>
          <Title fw={'normal'} order={4} c={'dark'}>
            Referent
          </Title>
          <UserThumbnail user={summary.reporter} size="md" />
        </Group>
        <Divider orientation={'vertical'} />
        <Group>
          <Title fw={'normal'} order={4} c={'dark'}>
            Deltakere
          </Title>

          <Avatar.Group>
            {summary.participants.map((user, i) => (
              <UserThumbnail user={user} size="md" key={i} />
            ))}
          </Avatar.Group>
        </Group>
      </Group>
      <ReceiptStats summary={summary} />
      <Divider size={1} />
      <RichTextContent html={summary.contents} />
    </>
  )
}
