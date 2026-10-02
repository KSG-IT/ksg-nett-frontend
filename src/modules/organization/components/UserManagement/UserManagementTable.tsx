import { Anchor, Avatar, Group, Text } from '@mantine/core'
import { DataTable, DataTableSortStatus } from 'mantine-datatable'
import { ManageInternalGroupUser } from 'modules/organization/types.graphql'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MembershipRowMenu,
  MembershipTypeBadge,
  membershipTypeLabel,
} from './MembershipActions'

export type ManageMembershipRecord = ManageInternalGroupUser & {
  active: boolean
}

// "V21" -> 42, "H21" -> 43, so semesters sort in time order
function semesterKey(shorthand: string | null) {
  if (!shorthand) return Number.MAX_SAFE_INTEGER
  const year = Number(shorthand.slice(1))
  return year * 2 + (shorthand.startsWith('H') ? 1 : 0)
}

const SORT_VALUES: Record<
  string,
  (record: ManageMembershipRecord) => string | number
> = {
  fullName: record => record.fullName,
  positionName: record => record.positionName,
  type: record => membershipTypeLabel(record.internalGroupPositionType) ?? '',
  period: record => semesterKey(record.dateJoinedSemesterShorthand),
}

interface UserManagementTableProps {
  records: ManageMembershipRecord[]
  onEditHistory: (userId: string) => void
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  records,
  onEditHistory,
}) => {
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<ManageMembershipRecord>
  >({ columnAccessor: 'fullName', direction: 'asc' })

  const sorted = useMemo(() => {
    const value = SORT_VALUES[sortStatus.columnAccessor as string]
    const direction = sortStatus.direction === 'asc' ? 1 : -1
    return [...records].sort((a, b) => {
      const [x, y] = [value(a), value(b)]
      if (typeof x === 'number' && typeof y === 'number')
        return (x - y) * direction
      return String(x).localeCompare(String(y), 'nb') * direction
    })
  }, [records, sortStatus])

  return (
    <DataTable<ManageMembershipRecord>
      records={sorted}
      idAccessor={record => record.internalGroupPositionMembership.id}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      withTableBorder
      borderRadius="md"
      highlightOnHover
      verticalSpacing="xs"
      fz="sm"
      minHeight={records.length === 0 ? 160 : undefined}
      noRecordsText="Ingen medlemskap"
      columns={[
        {
          accessor: 'fullName',
          title: 'Navn',
          sortable: true,
          render: record => (
            <Group gap="sm" wrap="nowrap">
              <Avatar name={record.fullName} color="initials" size="sm" />
              <Anchor component={Link} to={`/users/${record.userId}`} size="sm">
                {record.fullName}
              </Anchor>
            </Group>
          ),
        },
        { accessor: 'positionName', title: 'Verv', sortable: true },
        {
          accessor: 'type',
          title: 'Type',
          sortable: true,
          render: record => (
            <MembershipTypeBadge membership={record} active={record.active} />
          ),
        },
        {
          accessor: 'period',
          title: 'Periode',
          sortable: true,
          render: record => (
            <Text size="sm" c={record.active ? undefined : 'dimmed'}>
              {record.dateJoinedSemesterShorthand} –{' '}
              {record.dateEndedSemesterShorthand ?? 'nå'}
            </Text>
          ),
        },
        {
          accessor: 'actions',
          title: '',
          textAlign: 'right',
          width: 56,
          render: record => (
            <MembershipRowMenu
              membership={record}
              active={record.active}
              onEditHistory={onEditHistory}
            />
          ),
        },
      ]}
    />
  )
}
