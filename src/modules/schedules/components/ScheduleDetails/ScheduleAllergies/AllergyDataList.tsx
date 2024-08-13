import { ApolloError } from '@apollo/client'
import { Card, Group, Stack } from '@mantine/core'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { AllergyQueryReturns } from 'modules/schedules/views'
import { format } from 'util/date-fns'

export const AllergyDataList = ({
  data,
  error,
  loading,
}: {
  data: AllergyQueryReturns | undefined
  loading: boolean
  error: ApolloError | undefined
}) => {
  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  if (data === null) return <FullPage404 />

  const { scheduleAllergies } = data

  return (
    <Group display={'inline-flex'} align="flex-start">
      {scheduleAllergies.map(day => (
        <Card key={day.date}>
          <Stack>
            <b>{format(new Date(day.date), 'EEEE d MMMM')}</b>
            {day.allergyList.map(allergy => (
              <span>
                {allergy.name}: {allergy.count}
              </span>
            ))}
          </Stack>
        </Card>
      ))}
    </Group>
  )
}
