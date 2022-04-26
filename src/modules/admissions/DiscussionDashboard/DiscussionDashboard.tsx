import { useMutation, useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { LOCK_ADMISSION_MUTATION } from '../AdmissionDashboard/mutations'
import { AllInternalGroupsAcceptingApplicantsReturns } from '../types'
import { ALL_INTERNAL_GROUP_APPLICANT_DATA } from './queries'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
`

export const DiscussionDashboard: React.VFC = () => {
  /**
   * This component should show show some overall progress statistics of the different groups
   * Should also list shortcuts to internal group dashboards
   * Shows a profile card of the applicant and their values
   * Can also show statistics for the group on the top
   *
   */
  const history = useHistory()
  const { data, loading, error } =
    useQuery<AllInternalGroupsAcceptingApplicantsReturns>(
      ALL_INTERNAL_GROUP_APPLICANT_DATA
    )

  const [lockAdmission] = useMutation(LOCK_ADMISSION_MUTATION, {
    refetchQueries: ['ActiveAdmission'],
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleRedirect = (internalGroupId: string) => {
    history.push(`admissions/internal-group-discussion/${internalGroupId}`)
  }

  const { allInternalGroupApplicantData } = data
  return (
    <Wrapper>
      <Group position="apart" mb="md">
        <Title>Fordelingsmøtet</Title>
        <Button onClick={() => lockAdmission()}>
          Fordelingsmøtet er ferdig
        </Button>
      </Group>
      <Stack>
        {allInternalGroupApplicantData.map(data => (
          <Paper p="sm" key={data.internalGroup.id}>
            <Stack>
              <Title order={1}>{data.internalGroup.name}</Title>
              <Group>
                <RingProgress
                  label={
                    <Text size="xs" align="center">
                      Progresjon
                    </Text>
                  }
                  sections={[{ value: data.positionsToFill, color: 'orange' }]}
                />
                <Stack>
                  <Title order={2}>MVP's</Title>
                  {/* Can show who in each group has the most interview */}
                  <Group>
                    {['AO', 'SS', 'SH'].map(initials => (
                      <Stack>
                        <Avatar radius="xl" color="cyan">
                          {initials}
                        </Avatar>
                        <Text weight={600} size="sm">
                          Navn navnesen
                        </Text>
                        <Text size="xs">23 intervjuer</Text>
                      </Stack>
                    ))}
                  </Group>
                </Stack>
              </Group>
              <Group position="right">
                <Button
                  leftIcon={<FontAwesomeIcon icon="eye" />}
                  onClick={() => handleRedirect(data.internalGroup.id)}
                >
                  Mer detaljer
                </Button>
              </Group>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Wrapper>
  )
}
