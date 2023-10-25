import React from 'react'
import { ActionIcon, Button, Group, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'

const AdvancedSearch = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Avansert søk', path: '/advanced_search' },
  ]

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />
      <Group position="apart">
        <Title>Avansert søk</Title>
      </Group>
    </Stack>
  )
}
