import { gql, useQuery } from '@apollo/client'
import styled from 'styled-components'
import { NavGroup } from './NavGroup'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const SIDEBAR_QUERY = gql`
  query SidebarQuery {
    sidebarData {
      pendingQuotes
      pendingDeposits
    }
  }
`

export const SidebarNav = () => {
  const { data } = useQuery(SIDEBAR_QUERY)

  const pendingQuotes = data?.sidebarData.pendingQuotes ?? 0
  const pendingDeposits = data?.sidebarData.pendingDeposits ?? 0

  return (
    <Wrapper>
      <NavGroup
        navGroupTitle="Generelt"
        navItems={[
          { icon: 'home', link: '/dashboard', label: 'Kontrollpanel' },
          { icon: 'diagnoses', link: '/events', label: 'Arrangement' },
          { icon: 'edit', link: '/summaries', label: 'Møtereferater' },
          {
            icon: 'project-diagram',
            link: '/internal-groups',
            label: 'Interngjenger',
          },
        ]}
      />

      <NavGroup
        navGroupTitle="Underholdning"
        navItems={[
          {
            icon: 'quote-left',
            link: '/quotes',
            label: 'Sitater',
            notificationsCounter: pendingQuotes,
          },
          { icon: 'question', link: '/quiz', label: 'Quiz' },
          { icon: 'image', link: '/gallery', label: 'Galleri' },
        ]}
      />

      <NavGroup
        navGroupTitle="Admin"
        navItems={[
          { icon: 'car', link: '/schedules', label: 'Vaktlister' },
          { icon: 'address-book', link: '/users/manage', label: 'Personal' },
          { icon: 'user-plus', link: '/admissions', label: 'Opptak' },
          {
            icon: 'credit-card',
            link: '/economy/deposits',
            label: 'Innskudd',
            notificationsCounter: pendingDeposits,
          },
          {
            icon: 'shopping-bag',
            link: '/economy/sociproducts',
            label: 'Soci produker',
          },
          {
            icon: 'wheelchair',
            link: '/economy/soci-sessions',
            label: 'Krysselister',
          },
        ]}
      />
    </Wrapper>
  )
}
