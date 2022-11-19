import { useLazyQuery, useQuery } from '@apollo/client'
import { MultiSelect } from '@mantine/core'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { ALL_ACTIVE_USERS_LIST_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import { FC, useState } from 'react'
import { usersToSelectOption } from 'util/user'

interface AsyncShiftSlotSelectProps {
  shift: ShiftNode
}

export const AsyncShiftSlotSelect: FC<AsyncShiftSlotSelectProps> = props => {
  const [getUsers] = useLazyQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_LIST_QUERY)

  const users = props.shift.slots
    .map(slot => slot.user)
    .filter((u): u is ShiftNode['users'][0] => u !== null)

  const [data, setData] = useState<{ label: string; value: string }[]>(
    users.map(u => ({
      label: u.fullName,
      value: u.id,
    }))
  )

  return (
    <MultiSelect
      data={data}
      limit={20}
      defaultValue={users.map(u => u.id)}
      label="Slots"
      onSearchChange={q =>
        getUsers({
          variables: { q },
          onCompleted: res => {
            console.log(res)
            if (!res.allActiveUsersList) return
            setData(usersToSelectOption(res.allActiveUsersList))
          },
        })
      }
      searchable
      nothingFound="Nothing found"
    />
  )
}
