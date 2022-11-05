import { ActionIcon, Avatar, Group, Stack, Title } from '@mantine/core'
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
      <Group>
        <Title order={4} color={'dimmed'}>
          Til stede:
        </Title>
        <Avatar.Group>
          {summary.participants.map((user, i) => (
            <UserThumbnail user={user} size="md" key={i} />
          ))}
        </Avatar.Group>
      </Group>

      <Group>
        <Title order={4} color={'dimmed'}>
          Referent:
        </Title>
        <UserThumbnail user={summary.reporter} size="md" />
      </Group>

      <ReactMarkdown plugins={[remarkGfm]}>{summary.contents}</ReactMarkdown>
    </>
  )
}
