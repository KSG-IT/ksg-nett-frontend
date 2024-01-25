import React from 'react'
import {
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
import { Calendar, DateInput } from '@mantine/dates'

const AdvancedSearch = () => {
  const breadcrumbs = [
    { label: 'Hjem', path: '/' },
    { label: 'Avansert søk', path: '/advanced_search' },
  ]

  const { classes } = useStyles()

  /**
   * tidsperiode, søke kun på interngjeng, dropdown meny, åpne ny meny,
   * avkrysningsbokser,
   *
   * personsøk - avansert
   * status(aktiv), interngjeng,
   * --- hvordan vise resultatet ---
   * referater, håndboka,
   *
   * Style: fix full length, checkbox of forklaring separert, gjør person og
   * sitat og master i fanesøk så resultatvindu alltid er synlig
   *
   *
   */
  return (
    <Stack>
      <Breadcrumbs items={breadcrumbs} />

      <Title>Avansert søk</Title>
      <div>
        Finn din data gjennom avansert søk i KSG sin database! Et søk genererer
        de 10 første treffene og vises i vinduet nederst. Snevre inn søk ved
        hjelp av de ulike verktøyene
      </div>
      <Title order={2}>Person</Title>
      <div className={classes.searchWrapper}>
        <Stack>
          <Input placeholder="Søk på navn" />
          <Group>
            <div>Kjønn:</div>
            <Checkbox label="Mann" value="Mann" />
            <Checkbox label="Kvinne" value="Kvinne" />
          </Group>
          <Group>
            <div>Status:</div>
            <Checkbox label="Aktiv" value="Aktiv" />
            <Checkbox label="Pang" value="Pang" />
            <Checkbox label="Nypang" value="Nypang" />
            <Checkbox label="Nyopptatt" value="Nyopptatt" />
            <Checkbox label="Z person" value="Z person" />
          </Group>
          <Group>
            <div>Verv:</div>
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
          <Group>
            <div className={classes.button}>
              <Button>Personsøk</Button>
            </div>
          </Group>

          <Title order={2}>Sitater</Title>
          <Input placeholder="Søkeord i sitat" />
          <Input placeholder="Person som forfattet sitat" />
          <Group>
            <div>Dato postet fra:</div>
            <DateInput></DateInput>
            <div>Dato postet til:</div>
            <DateInput></DateInput>
          </Group>
          <Group>
            <div className={classes.button}>
              <Button>Sistatsøk</Button>
            </div>
          </Group>

          <Title order={2}>Alt i databasen</Title>
          <div>
            Dette søket går gjennom alt - referater, informasjoner, gjenger,
            personer, beskrivelser, sitater - alt. Lurt å være presis for å
            finne ditt ønskelige treff
          </div>
          <Input placeholder="Søk på alt i databasen" />
          <Group>
            <div className={classes.button}>
              <Button>Mastersøk</Button>
            </div>
          </Group>
        </Stack>
      </div>
      <Title order={1}>Resultat</Title>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  button: {
    width: '10%',
  },
  searchWrapper: {
    width: '50%',
  },
}))

export default AdvancedSearch
