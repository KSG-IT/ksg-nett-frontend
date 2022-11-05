import { useQuery } from '@apollo/client'
import { IconEdit, IconX } from '@tabler/icons'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserThumbnail } from 'modules/users/components'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { useTheme } from 'styled-components'
import {
  SummaryDetailQueryVariables,
  SummaryDetailsQueryReturns,
} from '../index'
import { SUMMARY_QUERY } from '../queries'
import { ActionIcon, Avatar, Group, Stack, Title } from '@mantine/core'
import { getSummaryTypeLabel } from '../util'
import { Breadcrumbs } from '../../../components/Breadcrumbs'
import { useState } from 'react'
import { Summary } from '../components/Summary'
import { SummaryForm } from '../components/SummaryForm'
import { format } from 'date-fns'

interface SummaryDetailParams {
  summaryId: string
}

export const SummaryDetail = () => {
  const params = useParams<keyof SummaryDetailParams>() as SummaryDetailParams
  const navigate = useNavigate()
  const theme = useTheme()
  const [editMode, setEditMode] = useState(false)

  const breadcrumbItems = [
    { label: 'Hjem', path: '/dashboard' },
    { label: 'Referater', path: '/summaries' },
  ]

  const { error, loading, data } = useQuery<
    SummaryDetailsQueryReturns,
    SummaryDetailQueryVariables
  >(SUMMARY_QUERY, {
    variables: { id: params.summaryId },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { summary } = data

  if (summary === null) return <FullPage404 />

  breadcrumbItems.push({
    label: `${format(
      new Date(summary.date),
      'dd.MM.yy'
    )} - ${getSummaryTypeLabel(summary.type)}`,
    path: `/summaries/${params.summaryId}`,
  })

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbItems} />
      <Group position={'apart'}>
        <div>
          <Title order={4} color={'dimmed'}>
            Type:
            <span style={{ color: 'black' }}>
              {' '}
              {getSummaryTypeLabel(summary.type)}
            </span>
          </Title>
        </div>
        <ActionIcon onClick={() => setEditMode(!editMode)}>
          {!editMode ? <IconEdit color={'gray'} /> : <IconX color={'gray'} />}
        </ActionIcon>
      </Group>

      {editMode ? (
        <SummaryForm
          summary={summary}
          onCompletedCallback={() => setEditMode(false)}
        />
      ) : (
        <Summary summary={summary} />
      )}
    </Stack>
  )
}
