import {
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  Title,
  createStyles,
} from '@mantine/core'
import {
  IconEye,
  IconMessage2,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { CardTable } from 'components/CardTable'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'util/date-fns'

const ForumDashboard: React.FC = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  return (
    <Stack>
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/dashboard' },
          { label: 'Forum', path: '' },
        ]}
      />
      <Title>Forum</Title>
      <Card>
        <Group position="apart">
          <TextInput
            className={classes.searchInput}
            icon={<IconSearch />}
            placeholder="Søk i forumet"
          />

          <Button leftIcon={<IconPlus />}>Ny tråd</Button>
        </Group>
      </Card>
      <CardTable highlightOnHover>
        <thead>
          <tr>
            <th>Tittel</th>
            <th>Forfatter</th>
            <th>Lagt ut</th>
            <th>
              <IconMessage2 />
            </th>
            <th>
              <IconEye />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            className={classes.tableRow}
            onClick={() => navigate('ksg-it-har-opptak')}
          >
            <td>KSG-IT har opptak!</td>
            <td>Alexander "Bøtte²" Orvik</td>
            <td>{formatDistanceToNow(new Date())}</td>
            <td>93</td>
            <td>417</td>
          </tr>
        </tbody>
      </CardTable>
    </Stack>
  )
}

const useStyles = createStyles(() => ({
  searchInput: {
    flex: 1,
  },
  tableRow: {
    cursor: 'pointer',
  },
}))

export default ForumDashboard
