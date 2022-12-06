import { useLazyQuery } from '@apollo/client'
import { MultiSelect } from '@mantine/core'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { ALL_ACTIVE_USERS_LIST_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import { FC, useState } from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { ShiftFormValues } from '../ScheduleDetails/ShiftCardModal'

interface AsyncShiftSlotSelectProps
  extends UseControllerProps<ShiftFormValues> {
  shift: ShiftNode
}

export const AsyncShiftSlotSelect: FC<AsyncShiftSlotSelectProps> = props => {
  const { field, fieldState } = useController(props)

  const [getUsers] = useLazyQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_LIST_QUERY)

  const users = props.shift.slots
    .map(slot => slot.user)
    .filter((u): u is ShiftNode['users'][0] => u !== null)
  //
  const [data, setData] = useState<{ label: string; value: string }[]>(
    users.map(u => ({
      label: u.fullName,
      value: u.id,
    }))
  )

  const handleSearch = (input: string) => {
    getUsers({
      variables: { q: input },
      onCompleted: result => {
        if (result.allActiveUsersList) {
          const users = [...data]
          for (const u of result.allActiveUsersList) {
            console.log(u)
            if (!users.find(user => user.value === u.id)) {
              users.push({
                label: u.getCleanFullName,
                value: u.id,
              })
            }
          }
          setData(users)
        }
      },
    })
  }

  return (
    <MultiSelect
      {...field}
      value={undefined}
      data={data}
      limit={20}
      defaultValue={users.map(u => u.id)}
      label="Slots"
      searchable
      onSearchChange={handleSearch}
      nothingFound="Nothing found"
    />
  )
}
