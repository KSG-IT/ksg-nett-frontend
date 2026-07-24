import { useQuery } from '@apollo/client'
import {
  IconAffiliate,
  IconBlockquote,
  IconBook,
  IconBook2,
  IconCalendarTime,
  IconChessKing,
  IconClipboardList,
  IconCreditCard,
  IconEdit,
  IconFlag,
  IconHandMiddleFinger,
  IconHome,
  IconUserPlus,
} from '@tabler/icons-react'
import { ALL_DOCUMENTS_QUERY } from 'modules/handbook/queries'
import { AllDocumentsReturn } from 'modules/handbook/types.graphql'
import { useMemo } from 'react'
import { PERMISSIONS } from 'util/permissions'
import { RouteItem } from './NavItem'

export interface RouteGroup {
  title: string
  items: RouteItem[]
}

function useHighlightedHandbookEntries(): RouteItem[] {
  const { data } = useQuery<AllDocumentsReturn>(ALL_DOCUMENTS_QUERY)

  return useMemo(
    () =>
      (data?.allDocuments ?? [])
        .filter(document => document.highlighted)
        .map(document => ({
          icon: IconBook,
          link: `handbook/document/${document.id}`,
          label: document.name,
          permissions: [],
        })),
    [data]
  )
}

export function useRouteGroups(): RouteGroup[] {
  const highlighted = useHighlightedHandbookEntries()

  return [
    {
      title: 'Generelt',
      items: [
        {
          icon: IconHome,
          link: '/dashboard',
          label: 'Kontrollpanel',
          permissions: [],
        },
        // {
        //   icon: IconMessage,
        //   link: '/forum',
        //   label: 'Forum',
        //   permissions: [],
        // },
        {
          icon: IconBook2,
          link: '/handbook',
          label: 'Håndboka',
          permissions: [],
        },
        {
          icon: IconEdit,
          link: '/summaries',
          label: 'Møtereferater',
          permissions: [],
        },
        {
          icon: IconAffiliate,
          link: '/internal-groups',
          label: 'Interngjenger',
          permissions: [],
        },
      ],
    },
    {
      title: 'Fremhevet',
      items: highlighted,
    },
    {
      title: 'Underholdning',
      items: [
        {
          icon: IconBlockquote,
          link: '/quotes',
          label: 'Sitater',
          permissions: [],
        },
        {
          icon: IconChessKing,
          link: '/knighthood',
          label: 'Ridderskap',
          permissions: [],
        },
      ],
    },
    {
      title: 'Admin',
      items: [
        {
          icon: IconCalendarTime,
          link: '/schedules',
          label: 'Vaktlister',
          permissions: PERMISSIONS.schedules.view.schedule,
        },
        {
          icon: IconUserPlus,
          link: '/admissions',
          label: 'Orvik',
          permissions: PERMISSIONS.admissions.view.admission,
        },
        {
          icon: IconHandMiddleFinger,
          link: '/users/user-types',
          label: 'Tilganger',
          permissions: PERMISSIONS.users.change.userType,
        },
        {
          icon: IconCreditCard,
          link: '/economy',
          label: 'Økonomi',
          permissions: PERMISSIONS.economy.view.sociSession,
        },
        {
          icon: IconClipboardList,
          link: '/economy/soci-sessions/live',
          label: 'Stilletime',
          permissions: PERMISSIONS.economy.add.sociOrderSession,
        },
        {
          icon: IconFlag,
          link: 'feature-flags',
          label: 'Feature flags',
          permissions: PERMISSIONS.featureFlags.view.featureFlag,
        },
      ],
    },
  ]
}
