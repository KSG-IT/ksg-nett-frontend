import { useMutation } from '@apollo/client'
import { ActionIcon, Button, Group, Menu, Table, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconDots, IconDoorExit, IconTimeline } from '@tabler/icons-react'
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
import { useState } from 'react'
import { MANAGE_USERS_DATA_QUERY } from '../../../users/queries'
import { InternalGroupPositionTypeSelect } from './InternalGroupPositionTypeSelect'

interface UserManagementTableRowProp {
  userData: ManageInternalGroupUser
  active: boolean
  onEditHistory: (userId: string) => void
}

export const UserManagementTableRow: React.FC<UserManagementTableRowProp> = ({
  userData,
  active,
  onEditHistory,
}) => {
  const [
    selectedInternalGroupPositionType,
    setSelectedInternalGroupPositionType,
  ] = useState<InternalGroupPositionType | null>(null)
  const [assignNewPosition, { loading }] = useMutation<
    AssignNewInternalGroupPositionMembershipReturns,
    AssignNewInternalGroupPositionMembershipVariables
  >(ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP, {
    refetchQueries: ['ManageUsersDataQuery'],
  })

  const { quitKSG } = useInternalGroupPositionMembershipMutations()

  const typeLabel = (type: InternalGroupPositionType | null) =>
    internalGroupPositionTypeOptions.find(option => option.value === type)
      ?.label ?? type

  const handleAssignNewPosition = () => {
    if (selectedInternalGroupPositionType === null) return

    if (
      selectedInternalGroupPositionType === userData.internalGroupPositionType
    )
      return

    modals.openConfirmModal({
      title: 'Endre type?',
      children: (
        <Text size="sm">
          {userData.fullName} går fra{' '}
          <b>{typeLabel(userData.internalGroupPositionType)}</b> til{' '}
          <b>{typeLabel(selectedInternalGroupPositionType)}</b>. Det nåværende
          vervet avsluttes i dag, og et nytt starter i dag.
        </Text>
      ),
      labels: { confirm: 'Endre', cancel: 'Avbryt' },
      onConfirm: () =>
        assignNewPosition({
          variables: {
            userId: userData.userId,
            internalGroupPositionId:
              userData.internalGroupPositionMembership.position.id,
            internalGroupPositionType: selectedInternalGroupPositionType,
          },
          refetchQueries: [MANAGE_USERS_DATA_QUERY],
          onCompleted() {
            showNotification({
              title: 'Suksess',
              message: 'Brukeren har fått ny type',
              color: 'green',
            })
          },
          onError({ message }) {
            showNotification({
              title: 'Noe gikk galt',
              message,
              color: 'red',
            })
          },
        }),
    })
  }

  function handleQuitKSG() {
    modals.openConfirmModal({
      title: 'Ferdig med KSG?',
      children: (
        <Text size="sm">Vervet til {userData.fullName} avsluttes i dag.</Text>
      ),
      labels: { confirm: 'Ferdig med KSG', cancel: 'Avbryt' },
      confirmProps: { color: 'red' },
      onConfirm: () =>
        quitKSG({
          variables: {
            membershipId: userData.internalGroupPositionMembership.id,
          },
          refetchQueries: [MANAGE_USERS_DATA_QUERY],
          onCompleted() {
            showNotification({
              title: 'Suksess',
              message: 'Snakkes aldri',
              color: 'green',
            })
          },
          onError({ message }) {
            showNotification({
              title: 'Noe gikk galt',
              message,
              color: 'red',
            })
          },
        }),
    })
  }

  const actionsMenu = (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <ActionIcon aria-label="Flere valg">
          <IconDots size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <PermissionGate permissions={MEMBERSHIP_HISTORY_PERMISSIONS}>
          <Menu.Item
            leftSection={<IconTimeline size={16} />}
            onClick={() => onEditHistory(userData.userId)}
          >
            Rediger vervhistorikk
          </Menu.Item>
        </PermissionGate>
        {active && (
          <Menu.Item
            color="red"
            leftSection={<IconDoorExit size={16} />}
            onClick={handleQuitKSG}
          >
            Ferdig med KSG
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  )

  if (!active) {
    return (
      <>
        <Table.Td>{userData.dateEndedSemesterShorthand}</Table.Td>
        <Table.Td>{actionsMenu}</Table.Td>
      </>
    )
  }

  return (
    <>
      <Table.Td>
        <InternalGroupPositionTypeSelect
          searchable
          placeholder="Velg type"
          onChange={setSelectedInternalGroupPositionType}
        />
      </Table.Td>
      <Table.Td>
        <Group wrap="nowrap">
          <Button
            color={'samfundet-red'}
            onClick={handleAssignNewPosition}
            disabled={loading}
          >
            Oppdater status
          </Button>
          {actionsMenu}
        </Group>
      </Table.Td>
    </>
  )
}
