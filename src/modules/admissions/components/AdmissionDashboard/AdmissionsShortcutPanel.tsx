import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Group, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export const AdmissionsShortcutPanel: React.VFC<{}> = () => {
  return (
    <Stack>
      <Group mt="sm">
        {/* Rewrite to list compnent */}
        <Link to="/admissions/my-interviews">
          <Card
            p="sm"
            style={{ aspectRatio: '1', borderRadius: '16px' }}
            withBorder
          >
            <Stack m="auto" align={'center'}>
              <FontAwesomeIcon icon="wheelchair" size="3x" />
              <Text weight={'bold'}>Mine intervjuer</Text>
            </Stack>
          </Card>
        </Link>

        <Link to="/admissions/applicants-overview">
          <Card
            p="sm"
            style={{ aspectRatio: '1', borderRadius: '16px' }}
            withBorder
          >
            <Stack m="auto" align={'center'}>
              <FontAwesomeIcon icon="users" size="3x" />
              <Text weight={'bold'}>Søkeroversikt</Text>
            </Stack>
          </Card>
        </Link>
      </Group>
    </Stack>
  )
}
