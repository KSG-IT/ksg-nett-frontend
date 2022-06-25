import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Group, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

export const AdmissionsShortcutPanel: React.VFC<{}> = () => {
  return (
    <Stack>
      <Title order={2}>Snarveier</Title>
      <Group mt="md">
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
      </Group>
    </Stack>
  )
}
