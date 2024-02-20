import React, { useState } from 'react'
import {
  Checkbox,
  Group,
  Stack,
  Title,
  createStyles,
  Grid,
  TextInput,
} from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
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
  const [konto, setKonto] = useState<string>('')

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
    <>
      {console.log(query, status, gang, verv, konto)}
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
                  <Checkbox
                    label="Pang"
                    checked={status.includes('Pang')}
                    onChange={() => handleCheckboxChange(setStatus, 'Pang')}
                  />
                  <Checkbox
                    label="Nyopptatt"
                    checked={status.includes('Nyopptatt')}
                    onChange={() =>
                      handleCheckboxChange(setStatus, 'Nyopptatt')
                    }
                  />
                  <Checkbox
                    label="Nypang"
                    checked={status.includes('Nypang')}
                    onChange={() => handleCheckboxChange(setStatus, 'Nypang')}
                  />
                  <Checkbox
                    label="Z person"
                    checked={status.includes('Z person')}
                    onChange={() => handleCheckboxChange(setStatus, 'Z person')}
                  />
                </Group>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={1}>Gjeng:</Grid.Col>
              <Grid.Col span="auto" offset={0.2}>
                <Group>
                  <Checkbox
                    label="Bar"
                    checked={gang.includes('Bar')}
                    onChange={() => handleCheckboxChange(setGang, 'Bar')}
                  />
                  <Checkbox
                    label="Sprit"
                    checked={gang.includes('Sprit')}
                    onChange={() => handleCheckboxChange(setGang, 'Sprit')}
                  />
                  <Checkbox
                    label="Arr"
                    checked={gang.includes('Arr')}
                    onChange={() => handleCheckboxChange(setGang, 'Arr')}
                  />
                  <Checkbox
                    label="Øko"
                    checked={gang.includes('Øko')}
                    onChange={() => handleCheckboxChange(setGang, 'Øko')}
                  />
                  <Checkbox
                    label="Edgar"
                    checked={gang.includes('Edgar')}
                    onChange={() => handleCheckboxChange(setGang, 'Edgar')}
                  />
                  <Checkbox
                    label="DH bar"
                    checked={gang.includes('DH bar')}
                    onChange={() => handleCheckboxChange(setGang, 'DH bar')}
                  />
                  <Checkbox
                    label="DH brygg"
                    checked={gang.includes('DH brygg')}
                    onChange={() => handleCheckboxChange(setGang, 'DH brygg')}
                  />
                  <Checkbox
                    label="Styret"
                    checked={gang.includes('Styret')}
                    onChange={() => handleCheckboxChange(setGang, 'Styret')}
                  />
                  <Checkbox
                    label="Lyche bar"
                    checked={gang.includes('Lyche bar')}
                    onChange={() => handleCheckboxChange(setGang, 'Lyche bar')}
                  />
                  <Checkbox
                    label="Lyche kjøkken"
                    checked={gang.includes('Lyche kjøkken')}
                    onChange={() =>
                      handleCheckboxChange(setGang, 'Lyche kjøkken')
                    }
                  />
                </Group>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={1}>Verv:</Grid.Col>
              <Grid.Col span="auto" offset={0.2}>
                <Group>
                  <Checkbox
                    label="Gjengis"
                    checked={verv.includes('Gjengis')}
                    onChange={() => handleCheckboxChange(setVerv, 'Gjengis')}
                  />
                  <Checkbox
                    label="Funksjonær"
                    checked={verv.includes('Funksjonær')}
                    onChange={() => handleCheckboxChange(setVerv, 'Funksjonær')}
                  />
                </Group>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={1}>Konto:</Grid.Col>
              <Grid.Col span="auto" offset={0.2}>
                <Group>
                  <Checkbox
                    label="+100kr"
                    radius="xl"
                    checked={konto === '100'}
                    onChange={() =>
                      setKonto(prev => (prev === '100' ? '' : '100'))
                    }
                  />
                  <Checkbox
                    label="+200kr"
                    radius="xl"
                    checked={konto === '200'}
                    onChange={() =>
                      setKonto(prev => (prev === '200' ? '' : '200'))
                    }
                  />
                  <Checkbox
                    label="+300kr"
                    radius="xl"
                    checked={konto === '300'}
                    onChange={() =>
                      setKonto(prev => (prev === '300' ? '' : '300'))
                    }
                  />
                  <Checkbox
                    label="+500kr"
                    radius="xl"
                    checked={konto === '500'}
                    onChange={() =>
                      setKonto(prev => (prev === '500' ? '' : '500'))
                    }
                  />
                </Group>
              </Grid.Col>
            </Grid>
          </Stack>
        </div>
        <UserGrid
          query={query}
          status={status}
          gang={gang}
          verv={verv}
          konto={konto}
        />
      </Stack>
    </>
  )
}

const useStyles = createStyles(theme => ({
  searchWrapper: {
    width: '100%',
  },
}))

export default AdvancedSearch
