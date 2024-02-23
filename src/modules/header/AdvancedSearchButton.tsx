import React from 'react'
import { ActionIcon, Tooltip } from '@mantine/core'
import { IconDatabaseSearch } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

const AdvancedSearchButton = () => {
  const navigate = useNavigate()

  return (
    <Tooltip label="Avansert søk" zIndex={999}>
      <ActionIcon
        color="samfundet-red"
        onClick={() => navigate(`/advanced_search`)}
      >
        <IconDatabaseSearch size={24} stroke={2} />
      </ActionIcon>
    </Tooltip>
  )
}

export default AdvancedSearchButton
