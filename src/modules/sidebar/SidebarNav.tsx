import styled from 'styled-components'
import { NavGroup } from './NavGroup'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const SidebarNav = () => {
  return (
    <Wrapper>
      <NavGroup
        navGroupTitle="Generelt"
        navItems={[
          { icon: 'home', link: '/dashboard', label: 'Kontrollpanel' },
          { icon: 'diagnoses', link: '/events', label: 'Arrangement' },
          { icon: 'money-bill', link: '/my-economy', label: 'Min økonomi' },
          { icon: 'calendar-alt', link: '/my-schedule', label: 'Min vaktplan' },
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
          { icon: 'quote-left', link: '/quotes', label: 'Sitater' },
          { icon: 'question', link: '/quiz', label: 'Quiz' },
          { icon: 'image', link: '/gallery', label: 'Galleri' },
        ]}
      />

      <NavGroup
        navGroupTitle="Admin"
        navItems={[
          { icon: 'car', link: '/schedules', label: 'Vaktlister' },
          { icon: 'address-book', link: '/users', label: 'Personal' },
          { icon: 'user-plus', link: '/admission', label: 'Opptak' },
          { icon: 'credit-card', link: '/economy/deposits', label: 'Innskudd' },
        ]}
      />
    </Wrapper>
  )
}
