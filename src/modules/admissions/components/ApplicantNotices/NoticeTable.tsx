import { ActionIcon, Button, Card, Menu, Table } from '@mantine/core'
import { IconDots, IconMail, IconPhone, IconTrash } from '@tabler/icons-react'
import { PermissionGate } from 'components/PermissionGate'
import { formatDistanceToNow } from 'util/date-fns'
import { NoticeMethodValues } from 'modules/admissions/consts'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { parseApplicantNoticeMethod } from 'modules/admissions/parsing'
import { APPLICANT_NOTICES_QUERY } from 'modules/admissions/queries'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { UserThumbnail } from 'modules/users/components/UserThumbnail'
import { useStore } from 'store'
import { ApplicantStatusBadge } from '../ApplicantStatusBadge'
import { ApplicantNoticeCommentInput } from './ApplicantNoticeCommentInput'
import { CardTable } from 'components/CardTable'

interface NoticeTableProps {
  applicants: Pick<
    ApplicantNode,
    | 'id'
    | 'fullName'
    | 'email'
    | 'phone'
    | 'status'
    | 'lastActivity'
    | 'lastNotice'
    | 'noticeMethod'
    | 'noticeComment'
    | 'noticeUser'
  >[]
}

export const NoticeTable: React.FC<NoticeTableProps> = ({ applicants }) => {
  const { patchApplicant } = useApplicantMutations()
  const me = useStore(state => state.user)

  function handleUpdateNotice(
    applicant: Pick<ApplicantNode, 'id'>,
    noticeMethod: NoticeMethodValues
  ) {
    patchApplicant({
      variables: {
        id: applicant.id,
        input: {
          lastNotice: new Date(),
          noticeMethod: noticeMethod,
          noticeUser: me.id,
        },
      },
      refetchQueries: [APPLICANT_NOTICES_QUERY],
    })
  }

  const rows = applicants.map(applicant => (
    <Table.Tr key={applicant.id}>
      <Table.Td>{applicant.fullName}</Table.Td>
      <Table.Td>{applicant.email}</Table.Td>
      <Table.Td>
        <a href={`tel:${applicant.phone}`}>{applicant.phone}</a>
      </Table.Td>
      <Table.Td>
        <ApplicantStatusBadge applicantStatus={applicant.status} />
      </Table.Td>
      <Table.Td>
        {applicant.lastActivity &&
          formatDistanceToNow(new Date(applicant.lastActivity))}
      </Table.Td>
      <Table.Td>
        {applicant.lastNotice &&
          formatDistanceToNow(new Date(applicant.lastNotice))}
      </Table.Td>
      <Table.Td>{parseApplicantNoticeMethod(applicant.noticeMethod)}</Table.Td>
      <Table.Td>
        <ApplicantNoticeCommentInput applicant={applicant} />
      </Table.Td>
      <Table.Td>
        {applicant.noticeUser && <UserThumbnail user={applicant.noticeUser} />}
      </Table.Td>
      <Table.Td>
        <Menu position="left-start" withinPortal>
          <Menu.Target>
            <ActionIcon>
              <IconDots size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconMail />}
              onClick={() =>
                handleUpdateNotice(applicant, NoticeMethodValues.EMAIL)
              }
            >
              Sendt epost
            </Menu.Item>
            <Menu.Item
              leftSection={<IconPhone />}
              onClick={() =>
                handleUpdateNotice(applicant, NoticeMethodValues.CALL)
              }
            >
              Har ringt
            </Menu.Item>

            <PermissionGate permissions={'admissions.delete_applicant'}>
              <Menu.Label>Admin</Menu.Label>
              <Menu.Item
                leftSection={<IconTrash />}
                color="red"
                onClick={() => {
                  // setApplicantToDelete(applicant)
                  // setDeleteModalOpen(true)
                }}
              >
                Slett søker
              </Menu.Item>
            </PermissionGate>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <CardTable compact>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Navn</Table.Th>
          <Table.Th>Epost</Table.Th>
          <Table.Th>Telefon</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Sist aktiv</Table.Th>
          <Table.Th>Sist varslet</Table.Th>
          <Table.Th>Varslingsmetode</Table.Th>
          <Table.Th>Kommentar</Table.Th>
          <Table.Th>Varslet av</Table.Th>
          <Table.Td></Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </CardTable>
  )
}
