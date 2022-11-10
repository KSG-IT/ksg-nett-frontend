import { Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { summaryTypeChoices } from '../conts'
import { SummaryType } from '../types'
import { SummaryForm } from '../components/SummaryForm'

const breadcrumbItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Referater', path: '/summaries' },
  { label: 'Opprett', path: '/summaries/create' },
]

type SummaryInput = {
  participants: string[]
  reporter: string
  contents: string
  grouping: string
  date: string
  type: SummaryType
}

export const CreateSummary: React.FC = () => {
  return (
    <Stack spacing="sm">
      <Breadcrumbs items={breadcrumbItems} />
      <Title>Opprett referat</Title>
      <SummaryForm onCompletedCallback={() => null} />
    </Stack>
  )
}
