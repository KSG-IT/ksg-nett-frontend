import { Table, Text, VisuallyHidden } from '@mantine/core'
import {
  SortableTh,
  TableDensity,
  UserCell,
  useTableSort,
} from 'components/Table'
import { ManageInternalGroupUser } from 'modules/organization/types.graphql'
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
  if (!shorthand) return null
  const year = Number(shorthand.slice(1))
  return year * 2 + (shorthand.startsWith('H') ? 1 : 0)
}

const SORT_GETTERS = {
  name: (record: ManageMembershipRecord) => record.fullName,
  type: (record: ManageMembershipRecord) =>
    membershipTypeLabel(record.internalGroupPositionType),
  period: (record: ManageMembershipRecord) =>
    semesterKey(record.dateJoinedSemesterShorthand),
}

interface UserManagementTableProps {
  records: ManageMembershipRecord[]
  onEditHistory: (userId: string) => void
  density: TableDensity
  tableProps: React.ComponentProps<typeof Table>
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  records,
  onEditHistory,
  density,
  tableProps,
}) => {
  const { sorted, headerProps } = useTableSort(records, SORT_GETTERS, {
    sortBy: 'name',
    direction: 'asc',
  })

  const rows = sorted.map(record => (
    <Table.Tr key={record.internalGroupPositionMembership.id}>
      <Table.Td>
        <UserCell
          to={`/users/${record.userId}`}
          name={record.fullName}
          compact={density === 'compact'}
          description={record.positionName}
        />
      </Table.Td>
      <Table.Td>
        <MembershipTypeBadge membership={record} active={record.active} />
      </Table.Td>
      <Table.Td>
        <Text fz="sm" c={record.active ? undefined : 'dimmed'}>
          {record.dateJoinedSemesterShorthand} –{' '}
          {record.dateEndedSemesterShorthand ?? 'nå'}
        </Text>
      </Table.Td>
      <Table.Td ta="right">
        <MembershipRowMenu
          membership={record}
          active={record.active}
          onEditHistory={onEditHistory}
        />
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Table.ScrollContainer minWidth={560}>
      <Table {...tableProps} highlightOnHover stickyHeader withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <SortableTh {...headerProps('name')}>Navn</SortableTh>
            <SortableTh {...headerProps('type')}>Type</SortableTh>
            <SortableTh {...headerProps('period')}>Periode</SortableTh>
            <Table.Th w={48}>
              <VisuallyHidden>Valg</VisuallyHidden>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center" c="dimmed" fz="sm" py="lg">
                  Ingen medlemskap
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
