import React, { useState } from 'react'
import {
  Checkbox,
  Group,
  Radio,
  Stack,
  Title,
  createStyles,
  Grid,
  TextInput,
} from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { UserGrid } from '../components/UserGrid'

const breadcrumbs = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Avansert søk', path: '/advanced_search' },
]

export const AdvancedSearch = () => {
  // Individual states for each search parameter
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string[]>([])
  const [gang, setGang] = useState<string[]>([])
  const [verv, setVerv] = useState<string[]>([])
  const [konto, setKonto] = useState('')

  const handleCheckboxChange = (
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setState(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  const { classes } = useStyles()

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />
      <Title>Avansert personsøk</Title>
      <div className={classes.searchWrapper}>
        <Stack spacing="xl">
          <TextInput
            icon={<IconSearch />}
            placeholder="Søk på navn"
            value={query}
            onChange={evt => setQuery(evt.target.value)}
          />
          <Grid>
            <Grid.Col span={1}>Status:</Grid.Col>
            <Grid.Col span="auto" offset={0.2}>
              <Group>
                <Checkbox
                  label="Aktiv"
                  checked={status.includes('Aktiv')}
                  onChange={() => handleCheckboxChange(setStatus, 'Aktiv')}
                />
                <Checkbox label="Pang" value="Pang" />
                <Checkbox label="Nyopptatt" value="Nyopptatt" />
                <Checkbox label="Nypang" value="Nypang" />
                <Checkbox label="Z person" value="Z person" />
              </Group>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={1}>Gjeng:</Grid.Col>
            <Grid.Col span="auto" offset={0.2}>
              <Group>
                <Checkbox label="Bar" value="Bar" />
                <Checkbox label="Sprit" value="Sprit" />
                <Checkbox label="Arr" value="Arr" />
                <Checkbox label="Øko" value="Øko" />
                <Checkbox label="Edgar" value="Edgar" />
                <Checkbox label="DH bar" value="DH bar" />
                <Checkbox label="DH brygg" value="DH brygg" />
                <Checkbox label="Styret" value="Styret" />
                <Checkbox label="Lyche bar" value="Lyche bar" />
                <Checkbox label="Lyche kjøkken" value="Lyche kjøkken" />
              </Group>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={1}>Verv:</Grid.Col>
            <Grid.Col span="auto" offset={0.2}>
              <Group>
                <Checkbox label="Gjengis" value="Gjengis" />
                <Checkbox label="Funksjonær" value="Funksjonær" />
              </Group>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={1}>Konto:</Grid.Col>
            <Grid.Col span="auto" offset={0.2}>
              <Radio.Group>
                <Group>
                  <Radio label="+100kr" value="+100kr" />
                  <Radio label="+200kr" value="+200kr" />
                  <Radio label="+500kr" value="+500kr" />
                  <Radio label="+1000kr" value="+1000kr" />
                </Group>
              </Radio.Group>
            </Grid.Col>
          </Grid>
        </Stack>
      </div>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  searchWrapper: {
    width: '100%',
  },
}))

export default AdvancedSearch
