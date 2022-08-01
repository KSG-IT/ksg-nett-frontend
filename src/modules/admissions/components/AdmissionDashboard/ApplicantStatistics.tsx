import { Card, Group, Stack, Text } from '@mantine/core'
import { AdmissionNode } from 'modules/admissions/types.graphql'

interface ApplicantStatisticsProps {
  admission: AdmissionNode
}

export const ApplicantStatistics: React.VFC<ApplicantStatisticsProps> = ({
  admission,
}) => {
  return (
    <Group>
      <Card p="md">
        <Stack>
          <Text size="xl">{admission.applicants.length} Søkere</Text>
        </Stack>
      </Card>
      <Card p="md">
        <Stack>
          <Text size="lg">107 Intervjuer</Text>
        </Stack>
      </Card>
    </Group>
  )
}
