import { Stack } from '@mantine/core'
import { ShiftNode } from '../types.graphql'
import { UserShiftCard } from './UserShiftCard'

interface UserShiftCardListProps {
  shifts: ShiftNode[]
}

export const UserShiftCardList: React.FC<UserShiftCardListProps> = ({
  shifts,
}) => {
  return (
    <Stack>
      {shifts.map(shift => (
        <UserShiftCard shift={shift} key={shift.id} />
      ))}
    </Stack>
  )
}
