import React from 'react'
import { ActionIcon, Group, Stack, Tooltip } from '@mantine/core'
import { IconDatabaseSearch } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { useNavigate } from 'react-router-dom'

const AdvancedSearchButton = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Avansert søk', path: '/advanced_search' },
  ]

  const navigate = useNavigate()

  return (
    <Tooltip label="Avansert søk">
      <ActionIcon
        color="samfundet-red"
        onClick={() => navigate(`document/advanced_search`)}
      >
        <IconDatabaseSearch size={24} stroke={2} />
      </ActionIcon>
    </Tooltip>
  )
}

export default AdvancedSearchButton
