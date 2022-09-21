import { Card, Group, Stack, Text } from '@mantine/core'
import { IconUsers, IconUserSearch, IconWheelchair } from '@tabler/icons'
import { Link } from 'react-router-dom'

export const AdmissionsShortcutPanel: React.VFC<{}> = () => {
  return (
    <Stack>
      <Group mt="sm">
        {/* Rewrite to list compnent */}
        <Link to="/admissions/my-interviews">
          <Card
            p="sm"
            style={{ width: '145px', height: '145px', borderRadius: '16px' }}
            withBorder
          >
            <Stack m="auto" align={'center'}>
              <IconWheelchair />
              <Text weight={'bold'}>Mine intervjuer</Text>
            </Stack>
          </Card>
        </Link>

        <Link to="/admissions/applicants-overview">
          <Card
            p="sm"
            style={{ width: '145px', height: '145px', borderRadius: '16px' }}
            withBorder
          >
            <Stack m="auto" align={'center'}>
              <IconUsers />
              <Text weight={'bold'}>Søkeroversikt</Text>
            </Stack>
          </Card>
        </Link>

        <Link to="/admissions/applicant-notices">
          <Card
            p="sm"
            style={{ width: '145px', height: '145px', borderRadius: '16px' }}
            withBorder
          >
            <Stack m="auto" align={'center'}>
              <IconUserSearch />
              <Text weight={'bold'}>Oppfølging</Text>
            </Stack>
          </Card>
        </Link>
      </Group>
    </Stack>
  )
}
