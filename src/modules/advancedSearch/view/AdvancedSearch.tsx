import React from 'react'
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Input,
  Radio,
  Stack,
  Title,
  createStyles,
} from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { Icon360 } from '@tabler/icons-react'

const AdvancedSearch = () => {
  const breadcrumbs = [
    { label: 'Hjem', path: '/' },
    { label: 'Avansert søk', path: '/advanced_search' },
  ]

  const { classes } = useStyles()

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />

      <Title>Avansert søk</Title>
      <div>Her er det bare å leke med komponenter i ulike varianter</div>
      <div className={classes.button}>
        <Button>Søkeknapp</Button>
      </div>

      <ActionIcon>
        <Icon360></Icon360>
      </ActionIcon>

      <div className={classes.searchWrapper}>
        <Stack>
          <Input placeholder="Søk på verv" />
          <Input placeholder="Søk på navn" />
          <Input placeholder="Søk på sitater" />
          <Input placeholder="Søk på alt i databasen" />
        </Stack>
      </div>

      <Group>
        <Radio label="Menn" value="Menn" />
        <Radio label="Kvinner" value="Kvinner" />
        <Radio label="Andre" value="Andre" />
      </Group>
      <Stack>
        <Checkbox defaultChecked label="No Z people" />
        <Checkbox label="Siste opptak" />
      </Stack>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  button: {
    width: '10%',
  },
  searchWrapper: {
    width: '30%',
  },
}))

export default AdvancedSearch
