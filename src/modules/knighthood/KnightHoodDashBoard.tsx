import { useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Card,
  createStyles,
  Group,
  Image,
  MantineProvider,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PermissionGate } from 'components/PermissionGate'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { KnightHoodAddUserModal } from './KnightHoodAddUserModal'
import { ALL_KNIGHTHOODS_QUERY } from './queries'
import { AllKnightHoodsQueryReturns, KnightHoodNode } from './types'

export const KnightHoodDashboard: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { data, loading, error } = useQuery<AllKnightHoodsQueryReturns>(
    ALL_KNIGHTHOODS_QUERY
  )

  const { classes } = useStyles()
  const navigate = useNavigate()
  const rows = (members: KnightHoodNode[]) => {
    return (
      <>
        {members.map(member => (
          <tr key={member.id} className={classes.tableRow}>
            <td>{member.user.getCleanFullName}</td>
            <td>{new Date(member.knightedAt).getFullYear()}</td>
          </tr>
        ))}
      </>
    )
  }

  if (error || !data) {
    return <FullPageError />
  }
  if (loading) {
    return <FullContentLoader />
  }

  const { allKnighthoods } = data

  return (
    <MantineProvider
      theme={{
        components: {
          Card: { styles: { root: { fontFamily: 'Baskerville, serif' } } },
          Text: { styles: { root: { fontFamily: 'inherit' } } },
          Title: { styles: { root: { fontFamily: 'inherit' } } },
          Table: { styles: { root: { fontFamily: 'inherit' } } },
        },
      }}
      inherit
    >
      <Stack>
        <Group position="apart">
          <Breadcrumbs
            items={[
              { label: 'Hjem', path: '/dashboard' },
              { label: 'Ridderskap', path: '' },
            ]}
          />
          <PermissionGate permissions={PERMISSIONS.users.change.user}>
            <Button
              leftIcon={<IconPlus />}
              onClick={() => {
                setOpen(true)
              }}
            >
              Nytt ridderskap
            </Button>
          </PermissionGate>
        </Group>

        <Card className={classes.card} withBorder>
          <Stack align="center">
            <Image
              className={classes.image}
              src="https://i.imgur.com/s5pNI5t.png"
              alt="Det Gyldne Tappetaarn"
              height={250}
              width={250}
            />
            <Text>
              <Title
                ff={'Baskerville'}
                transform="uppercase"
                fw={500}
                className={classes.title}
                order={1}
              >
                Det Gyldne Tappetaarn
              </Title>
            </Text>
          </Stack>
          <Stack ml={'15%'} w={'70%'} my={'xl'}>
            <Text className={classes.text}>
              <Title className={classes.subtitle} align="center" order={3}>
                Om ordenen
              </Title>
              Riddere av Det Gyldne Tappetaarn er personer som har blitt erkjent
              for sine utmerkede bidrag til KSG (KISS og SG). Ordenen ble
              opprettet i 2024 for å hedre de som har gjort en ekstraordinær
              innsats for å forme KSG.
            </Text>
            <Text className={classes.text}>
              <Title className={classes.subtitle} order={3}>
                Nominering
              </Title>
              Det åpnes årlig for nominasjon av nye riddere. Nominasjonsteksten
              bør inneholde hva den nominerte har bidratt til og hvorfor
              vedkommende har gjort en innsats utover det forventede av vervet
              sitt. Det kan f.eks. være en person som har tatt på seg et
              prosjekt utenfor sitt eget ansvarsområde, eller som har bidratt
              til å løse en vanskelig utfordring i organisasjonen. Nominasjonen
              sendes til gjengsjef, som sammen med de andre ridderne vurderer om
              den nominerte er verdig en plass i ordenen.
            </Text>
            <Text className={classes.text}>
              <Title className={classes.subtitle} order={3}>
                Medlemmer
              </Title>
              Det er for tiden {allKnighthoods.length} medlemmer av Det Gyldne
              Tappetaarn. Under kan du se en oversikt over de som har blitt
              slått til ridder. Ved innmelding i orden utmerkes medlemmet med en
              ridderdalje.
            </Text>
          </Stack>

          <Box p="xl"></Box>
          <Stack justify="center" align="center">
            <Table className={classes.table} fontSize={'lg'}>
              <thead>
                <tr>
                  <th>Navn</th>
                  <th>Ble slått til ridder</th>
                </tr>
              </thead>
              <tbody>{rows(allKnighthoods)}</tbody>
            </Table>
          </Stack>
        </Card>
        <KnightHoodAddUserModal opened={open} onClose={() => setOpen(false)} />
      </Stack>
    </MantineProvider>
  )
}

const useStyles = createStyles(() => ({
  searchInput: {
    flex: 1,
  },
  tableRow: {
    cursor: 'pointer',
  },
  image: {
    borderRadius: '42%',
    overflow: 'hidden',
  },
  title: {
    textAlign: 'center',
    color: '#102c57',
  },
  card: {
    width: '100%',
    backgroundColor: '#f8f0e5',
  },
  text: {
    color: '#102c57',
  },
  subtitle: {
    color: '#102c57',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 500,
  },

  table: {
    width: '60%',
    borderCollapse: 'collapse',
    color: '#102c57',
    fontSize: 24,
    '& th': {
      textAlign: 'left',
      padding: '8px',
      fontSize: 24,
    },
    '& td': {
      padding: '8px',
    },
    '& tr': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    '& thead': {
      borderBottom: '1px solid #102c57',
    },
    '& th:first-of-type, & td:first-of-type': {
      flex: 1,
    },
    '& th:last-of-type, & td:last-of-type': {
      textAlign: 'right',
    },
  },
}))
