import { ActionIcon, Button, Card, Menu, Table } from '@mantine/core'
import { IconDots, IconMail, IconPhone, IconTrash } from '@tabler/icons'
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
    <tr key={applicant.id}>
      <td>{applicant.fullName}</td>
      <td>{applicant.email}</td>
      <td>
        <a href={`tel:${applicant.phone}`}>{applicant.phone}</a>
      </td>
      <td>
        <ApplicantStatusBadge applicantStatus={applicant.status} />
      </td>
      <td>
        {applicant.lastActivity &&
          formatDistanceToNow(new Date(applicant.lastActivity))}
      </td>
      <td>
        {applicant.lastNotice &&
          formatDistanceToNow(new Date(applicant.lastNotice))}
      </td>
      <td>{parseApplicantNoticeMethod(applicant.noticeMethod)}</td>
      <td>
        <ApplicantNoticeCommentInput applicant={applicant} />
      </td>
      <td>
        {applicant.noticeUser && <UserThumbnail user={applicant.noticeUser} />}
      </td>
      <td>
        <Menu position="left-start" withinPortal>
          <Menu.Target>
            <ActionIcon>
              <IconDots size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              icon={<IconMail />}
              onClick={() =>
                handleUpdateNotice(applicant, NoticeMethodValues.EMAIL)
              }
            >
              Sendt epost
            </Menu.Item>
            <Menu.Item
              icon={<IconPhone />}
              onClick={() =>
                handleUpdateNotice(applicant, NoticeMethodValues.CALL)
              }
            >
              Har ringt
            </Menu.Item>

            <PermissionGate permissions={'admissions.delete_applicant'}>
              <Menu.Label>Admin</Menu.Label>
              <Menu.Item
                icon={<IconTrash />}
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
      </td>
    </tr>
  ))

  return (
    <CardTable fontSize={12}>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Epost</th>
          <th>Telefon</th>
          <th>Status</th>
          <th>Sist aktiv</th>
          <th>Sist varslet</th>
          <th>Varslingsmetode</th>
          <th>Kommentar</th>
          <th>Varslet av</th>
          <td></td>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </CardTable>
  )
}
