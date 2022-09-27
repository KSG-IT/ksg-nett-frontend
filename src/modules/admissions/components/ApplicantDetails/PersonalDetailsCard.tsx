import { Grid, Group, Image, Paper, Stack, Text } from '@mantine/core'
import { format } from 'date-fns'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'

interface LabelProps {
  children: React.ReactNode
}

const Label: React.FC<LabelProps> = ({ children }) => {
  return (
    <Text weight="bold" size="xs" color="gray.500">
      {children}
    </Text>
  )
}

interface PersonalDetailsCardProps {
  applicant: ApplicantNode
}

export const PersonalDetailsCard: React.VFC<PersonalDetailsCardProps> = ({
  applicant,
}) => {
  return (
    <Paper p="md" style={{ maxWidth: 800 }}>
      <Grid grow gutter="lg">
        <Image height={250} width={250} src={applicant.image} />
        <Stack>
          <Group align="flex-start" spacing={'xs'} p="xl">
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Navn</Label>
              <Text m="0"> {applicant.fullName}</Text>
            </Stack>
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Hjemby</Label>
              <Text>{applicant.hometown}</Text>
            </Stack>
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Studie</Label>
              <Text>{applicant.study}</Text>
            </Stack>
          </Group>
          <Group align="flex-start" spacing={'xs'} p="xl">
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Fødselsdate</Label>
              <Text>
                {format(new Date(applicant.dateOfBirth), 'dd.MM.yyyy')}
              </Text>
            </Stack>
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Adresse</Label>
              <Text>{applicant.address}</Text>
            </Stack>
            <Stack>
              <Label>Status</Label>
              <ApplicantStatusBadge applicantStatus={applicant.status} />
            </Stack>
          </Group>
        </Stack>
      </Grid>
    </Paper>
  )
}
