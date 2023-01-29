import {
  Avatar,
  Button,
  Group,
  Paper,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconEye } from '@tabler/icons'
import { InternalGroupApplicantData } from 'modules/admissions/types.graphql'
import { Link } from 'react-router-dom'

export const InternalGroupPreviewCard: React.FC<{
  internalGroupDiscussionData: InternalGroupApplicantData
}> = ({ internalGroupDiscussionData }) => {
  return (
    <Paper p="sm" key={internalGroupDiscussionData.internalGroup.id}>
      <Stack>
        <Title order={1}>
          {internalGroupDiscussionData.internalGroup.name}
        </Title>
        <Group>
          <RingProgress
            label={
              <Text size="xs" align="center">
                Progresjon
              </Text>
            }
            sections={[
              {
                value: internalGroupDiscussionData.currentProgress,
                color: 'orange',
              },
            ]}
          />
          <Stack>
            <Title order={2}>MVP's</Title>
            {/* Can show who in each group has the most interview */}
            <Group>
              {['AO', 'SS', 'SH'].map((initials, index) => (
                <Stack key={index}>
                  <Avatar radius="xl" color="cyan">
                    {initials}
                  </Avatar>
                  <Text weight={600} size="sm">
                    Alexander Orvik
                  </Text>
                  <Text size="xs">23 intervjuer</Text>
                </Stack>
              ))}
            </Group>
          </Stack>
        </Group>
        <Group position="right">
          <Link to={`${internalGroupDiscussionData.internalGroup.id}`}>
            <Button leftIcon={<IconEye />}>Mer detaljer</Button>
          </Link>
        </Group>
      </Stack>
    </Paper>
  )
}
