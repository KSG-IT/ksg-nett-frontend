import { useQuery } from '@apollo/client'
import { Box, Group, Paper, Text, Title } from '@mantine/core'
import { FullContentLoader } from 'components/Loading'
import { INTERNAL_GROUPS_ACCEPTING_APPLICANTS } from 'modules/admissions/queries'
import { InternalGroupsAcceptingApplicantsReturns } from 'modules/admissions/types.graphql'
import { Link } from 'react-router-dom'

export const InternalGroupsNav: React.FC = () => {
  const { error, loading, data } =
    useQuery<InternalGroupsAcceptingApplicantsReturns>(
      INTERNAL_GROUPS_ACCEPTING_APPLICANTS
    )

  if (error) return null

  if (loading || !data) return <FullContentLoader />

  const { internalGroupsAcceptingApplicants } = data

  return (
    <>
      <Title order={2}>Gjenger som har eksternopptak</Title>
      <Group>
        {internalGroupsAcceptingApplicants.map(group => (
          <Link to={`internal-group-applicants/${group.id}`}>
            <Box>
              <Paper
                sx={() => ({
                  '&:hover': {
                    // ToDo add a theme
                    opacity: 0.7,
                  },
                })}
                p="xl"
                style={{ cursor: 'pointer' }}
              >
                <Text size="xl">{group.name}</Text>
              </Paper>
            </Box>
          </Link>
        ))}
      </Group>
    </>
  )
}
