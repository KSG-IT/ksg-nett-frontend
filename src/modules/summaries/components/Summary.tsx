import {
  ActionIcon,
  Avatar,
  Badge,
  Divider,
  Group,
  Stack,
  Title,
} from '@mantine/core'
import { Breadcrumbs } from '../../../components/Breadcrumbs'
import { getSummaryTypeLabel } from '../util'
import { Link } from 'react-router-dom'
import { IconEdit } from '@tabler/icons'
import { UserThumbnail } from '../../users/components'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SummaryNode } from '../types'

interface SummaryProps {
  summary: SummaryNode
}

export const Summary: React.FC<SummaryProps> = ({ summary }: SummaryProps) => {
  return (
    <>
      <Group position={'left'}>
        <Badge variant={'filled'} size={'lg'} color={'samfundet-red'}>
          {getSummaryTypeLabel(summary.type)}
        </Badge>
        <Divider orientation={'vertical'} />
        <Group>
          <Title weight={'lighter'} order={4} color={'dark'}>
            Referent
          </Title>

          <UserThumbnail user={summary.reporter} size="md" />
        </Group>
        <Divider orientation={'vertical'} />
        <Group>
          <Title weight={'lighter'} order={4} color={'dark'}>
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
