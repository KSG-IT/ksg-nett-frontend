import { Button, Group, Stack, Text } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { ManageInternalGroupUser } from 'modules/organization/types.graphql'
import { useState } from 'react'

interface InternalGroupMembershipProps {
  membership: ManageInternalGroupUser
  onSubmitCallback: (data: { dateJoined: Date; dateEnded: Date }) => void
}

export const InternalGroupMembership: React.FC<
  InternalGroupMembershipProps
> = ({ membership, onSubmitCallback }) => {
  const [startDate, setStartDate] = useState(
    new Date(membership.internalGroupPositionMembership.dateJoined)
  )
  const [endDate, setEndDate] = useState(
    new Date(membership.internalGroupPositionMembership.dateEnded)
  )
  return (
    <Stack>
      <Group>
        <Text>Start</Text>
        <DateInput
          value={startDate}
          onChange={date => {
            setStartDate(date as Date)
          }}
        />
      </Group>
      <Group>
        <Text>Slutt</Text>
        <DateInput
          value={endDate}
          onChange={date => setEndDate(date as Date)}
        />
      </Group>
      <Button
        onClick={() =>
          onSubmitCallback({ dateJoined: startDate, dateEnded: endDate })
        }
      >
        Lagre
      </Button>
    </Stack>
  )
}
