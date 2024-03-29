import { Grid, Group, Image, Paper, Stack, Text, Title } from '@mantine/core'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { format } from 'util/date-fns'
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

export const PersonalDetailsCard: React.FC<PersonalDetailsCardProps> = ({
  applicant,
}) => {
  return (
    <Paper p="md" style={{ maxWidth: 800 }}>
      <Grid grow gutter="lg">
        {applicant.image && (
          <Image height={250} width={250} src={applicant.image} />
        )}
        <Stack>
          <Group align="flex-start" spacing={'xs'} p="xl">
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Epost</Label>
              <Text m="0"> {applicant.email}</Text>
            </Stack>
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Hjemby</Label>
              <Text>{applicant.hometown}</Text>
            </Stack>
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Studie</Label>
              <Text>{applicant.study}</Text>
            </Stack>
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Telefon</Label>
              <Text>{applicant.phone}</Text>
            </Stack>
          </Group>

          <Group align="flex-start" spacing={'xs'} p="xl">
            <Stack justify={'flex-start'} align="flex-start" spacing="xs">
              <Label>Fødselsdato</Label>
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
