import { Button, Popover } from '@mantine/core'
import { ManageInternalGroupUser } from 'modules/organization/types.graphql'
import { InternalGroupMembership } from './InternalGroupMembership'
import { useInternalGroupPositionMembershipMutations } from 'modules/organization/mutations.hooks'
import { format } from 'date-fns'
import { showNotification } from '@mantine/notifications'

interface InternalGroupMembershipDateProps {
  membership: ManageInternalGroupUser
  activeMemberships: boolean
}

export const InternalGroupMembershipDate: React.FC<
  InternalGroupMembershipDateProps
> = ({ membership, activeMemberships }) => {
  // import mutation for membershipdate

  const { changeMembershipDate, changeMembershipDateLoading } =
    useInternalGroupPositionMembershipMutations()

  const handleChangeDates = (
    membership: ManageInternalGroupUser,
    data: { dateJoined: Date; dateEnded: Date }
  ) => {
    changeMembershipDate({
      variables: {
        membershipId: membership.internalGroupPositionMembership.id,
        dateJoined: format(data.dateJoined, 'yyyy-MM-dd'),
        dateEnded: format(data.dateEnded, 'yyyy-MM-dd'),
      },
      refetchQueries: ['ManageUsersDataQuery'],
      onError() {
        showNotification({
          title: 'Feil',
          message: 'Noe gikk galt',
          color: 'red',
        })
      },
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Brukeren har fått nytt verv',
          color: 'green',
        })
      },
    })
  }

  // NOOB : Make the mutation set a new shorthand date format
  return (
    <Popover withArrow shadow="lg">
      <Popover.Target>
        <Button radius={'xl'} variant="subtle">
          {membership.dateJoinedSemesterShorthand}{' '}
          {!activeMemberships
            ? ` - 
      ${membership.dateEndedSemesterShorthand}`
            : null}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <InternalGroupMembership
          membership={membership}
          onSubmitCallback={data => handleChangeDates(membership, data)}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
