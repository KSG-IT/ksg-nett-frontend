import {
  Anchor,
  Center,
  Flex,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { IconUser } from '@tabler/icons-react'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { format } from 'util/date-fns'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'

const IMAGE_SIZE = 220

interface FieldProps {
  label: string
  children: React.ReactNode
}

const Field: React.FC<FieldProps> = ({ label, children }) => (
  <Stack gap={4}>
    <Text fw="bold" size="xs" c="dimmed">
      {label}
    </Text>
    <Text size="sm" style={{ overflowWrap: 'anywhere' }}>
      {children || '–'}
    </Text>
  </Stack>
)

interface PersonalDetailsCardProps {
  applicant: ApplicantNode
}

export const PersonalDetailsCard: React.FC<PersonalDetailsCardProps> = ({
  applicant,
}) => {
  const fullName = `${applicant.firstName} ${applicant.lastName}`
  return (
    <Paper p="md" maw={900}>
      <Flex direction={{ base: 'column', sm: 'row' }} gap="lg">
        {applicant.image ? (
          <Anchor
            href={applicant.image}
            target="_blank"
            rel="noreferrer"
            style={{ flexShrink: 0, alignSelf: 'center' }}
          >
            <Image
              src={applicant.image}
              alt={`Bilde av ${fullName}`}
              w={IMAGE_SIZE}
              h={IMAGE_SIZE}
              fit="cover"
              radius="md"
            />
          </Anchor>
        ) : (
          <Center
            w={IMAGE_SIZE}
            h={IMAGE_SIZE}
            bg="gray.1"
            c="gray.5"
            style={{
              flexShrink: 0,
              alignSelf: 'center',
              borderRadius: 'var(--mantine-radius-md)',
            }}
          >
            <Stack align="center" gap={4}>
              <IconUser size={48} />
              <Text size="xs">Ingen bilde</Text>
            </Stack>
          </Center>
        )}
        <SimpleGrid
          cols={{ base: 1, xs: 2, md: 3 }}
          spacing="lg"
          verticalSpacing="md"
          style={{ flex: 1, alignContent: 'start' }}
        >
          <Field label="Epost">{applicant.email}</Field>
          <Field label="Telefon">{applicant.phone}</Field>
          <Field label="Fødselsdato">
            {applicant.dateOfBirth &&
              format(new Date(applicant.dateOfBirth), 'dd.MM.yyyy')}
          </Field>
          <Field label="Studie">{applicant.study}</Field>
          <Field label="Hjemby">{applicant.hometown}</Field>
          <Field label="Adresse">{applicant.address}</Field>
          <Stack gap={4}>
            <Text fw="bold" size="xs" c="dimmed">
              Status
            </Text>
            <div>
              <ApplicantStatusBadge applicantStatus={applicant.status} />
            </div>
          </Stack>
        </SimpleGrid>
      </Flex>
    </Paper>
  )
}
