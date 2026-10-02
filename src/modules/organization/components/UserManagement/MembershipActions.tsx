import { useMutation } from '@apollo/client'
import { ActionIcon, Badge, Menu, Text, UnstyledButton } from '@mantine/core'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import {
  IconChevronDown,
  IconDots,
  IconDoorExit,
  IconSwitchHorizontal,
  IconTimeline,
} from '@tabler/icons-react'
import { PermissionGate } from 'components/PermissionGate'
import {
  internalGroupPositionTypeOptions,
  MEMBERSHIP_HISTORY_PERMISSIONS,
} from 'modules/organization/consts'
import { ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP } from 'modules/organization/mutations'
import { useInternalGroupPositionMembershipMutations } from 'modules/organization/mutations.hooks'
import {
  AssignNewInternalGroupPositionMembershipReturns,
  AssignNewInternalGroupPositionMembershipVariables,
  InternalGroupPositionType,
  ManageInternalGroupUser,
} from 'modules/organization/types.graphql'
import { MANAGE_USERS_DATA_QUERY } from 'modules/users/queries'

const TYPE_COLORS: Record<InternalGroupPositionType, string> = {
  FUNCTIONARY: 'samfundet-red',
  GANG_MEMBER: 'blue',
  HANGAROUND: 'teal',
  INTEREST_GROUP_MEMBER: 'violet',
  TEMPORARY_LEAVE: 'yellow',
  ACTIVE_FUNCTIONARY_PANG: 'gray',
  ACTIVE_GANG_MEMBER_PANG: 'gray',
  OLD_FUNCTIONARY_PANG: 'gray',
  OLD_GANG_MEMBER_PANG: 'gray',
}

export function membershipTypeLabel(type: InternalGroupPositionType | null) {
  return (
    internalGroupPositionTypeOptions.find(option => option.value === type)
      ?.label ?? type
  )
}

function useMembershipActions(membership: ManageInternalGroupUser) {
  const [assignNewPosition] = useMutation<
    AssignNewInternalGroupPositionMembershipReturns,
    AssignNewInternalGroupPositionMembershipVariables
  >(ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP, {
    refetchQueries: [MANAGE_USERS_DATA_QUERY],
  })
  const { quitKSG } = useInternalGroupPositionMembershipMutations()

  const onError = ({ message }: { message: string }) =>
    showNotification({ title: 'Noe gikk galt', message, color: 'red' })

  function changeType(type: InternalGroupPositionType) {
    if (type === membership.internalGroupPositionType) return

    modals.openConfirmModal({
      title: 'Endre type?',
      children: (
        <Text size="sm">
          {membership.fullName} går fra{' '}
          <b>{membershipTypeLabel(membership.internalGroupPositionType)}</b> til{' '}
          <b>{membershipTypeLabel(type)}</b>. Det nåværende vervet avsluttes i
          dag, og et nytt starter i dag.
        </Text>
      ),
      labels: { confirm: 'Endre', cancel: 'Avbryt' },
      onConfirm: () =>
        assignNewPosition({
          variables: {
            userId: membership.userId,
            internalGroupPositionId:
              membership.internalGroupPositionMembership.position.id,
            internalGroupPositionType: type,
          },
          onCompleted() {
            showNotification({
              title: 'Suksess',
              message: 'Brukeren har fått ny type',
              color: 'green',
            })
          },
          onError,
        }),
    })
  }

  function quit() {
    modals.openConfirmModal({
      title: 'Ferdig med KSG?',
      children: (
        <Text size="sm">Vervet til {membership.fullName} avsluttes i dag.</Text>
      ),
      labels: { confirm: 'Ferdig med KSG', cancel: 'Avbryt' },
      confirmProps: { color: 'red' },
      onConfirm: () =>
        quitKSG({
          variables: {
            membershipId: membership.internalGroupPositionMembership.id,
          },
          refetchQueries: [MANAGE_USERS_DATA_QUERY],
          onCompleted() {
            showNotification({
              title: 'Suksess',
              message: 'Snakkes aldri',
              color: 'green',
            })
          },
          onError,
        }),
    })
  }

  return { changeType, quit }
}

function TypeMenuItems({
  current,
  onSelect,
}: {
  current: InternalGroupPositionType
  onSelect: (type: InternalGroupPositionType) => void
}) {
  return (
    <>
      {internalGroupPositionTypeOptions
        .filter(option => option.value !== current)
        .map(option => (
          <Menu.Item key={option.value} onClick={() => onSelect(option.value)}>
            {option.label}
          </Menu.Item>
        ))}
    </>
  )
}

interface MembershipProps {
  membership: ManageInternalGroupUser
  active: boolean
}

// The type as a small badge. On active memberships it opens a menu to change it.
export const MembershipTypeBadge: React.FC<MembershipProps> = ({
  membership,
  active,
}) => {
  const { changeType } = useMembershipActions(membership)
  const type = membership.internalGroupPositionType
  const badge = (
    <Badge
      size="sm"
      variant="light"
      color={TYPE_COLORS[type] ?? 'gray'}
      rightSection={active ? <IconChevronDown size={12} /> : undefined}
    >
      {membershipTypeLabel(type)}
    </Badge>
  )

  if (!active) return badge

  return (
    <Menu position="bottom-start" withinPortal>
      <Menu.Target>
        <UnstyledButton aria-label="Endre type">{badge}</UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Endre type</Menu.Label>
        <TypeMenuItems current={type} onSelect={changeType} />
      </Menu.Dropdown>
    </Menu>
  )
}

interface MembershipRowMenuProps extends MembershipProps {
  onEditHistory: (userId: string) => void
}

export const MembershipRowMenu: React.FC<MembershipRowMenuProps> = ({
  membership,
  active,
  onEditHistory,
}) => {
  const { changeType, quit } = useMembershipActions(membership)

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray" aria-label="Flere valg">
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {active && (
          <Menu.Sub>
            <Menu.Sub.Target>
              <Menu.Sub.Item leftSection={<IconSwitchHorizontal size={16} />}>
                Endre type
              </Menu.Sub.Item>
            </Menu.Sub.Target>
            <Menu.Sub.Dropdown>
              <TypeMenuItems
                current={membership.internalGroupPositionType}
                onSelect={changeType}
              />
            </Menu.Sub.Dropdown>
          </Menu.Sub>
        )}
        <PermissionGate permissions={MEMBERSHIP_HISTORY_PERMISSIONS}>
          <Menu.Item
            leftSection={<IconTimeline size={16} />}
            onClick={() => onEditHistory(membership.userId)}
          >
            Rediger vervhistorikk
          </Menu.Item>
        </PermissionGate>
        {active && (
          <>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconDoorExit size={16} />}
              onClick={quit}
            >
              Ferdig med KSG
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}
