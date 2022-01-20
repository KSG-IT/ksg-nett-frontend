import styled from 'styled-components'
import { NavItemProps, NavItem } from './NavItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  margin-left: ;
`

const NavGroupTitle = styled.h5`
  margin: 0 0 0 15px;
  font-weight: 600;
`

interface NavGroupProps {
  navGroupTitle: string
  navItems: NavItemProps[]
}

export const NavGroup: React.FC<NavGroupProps> = ({
  navGroupTitle,
  navItems,
}) => {
  return (
    <Wrapper>
      <NavGroupTitle>{navGroupTitle}</NavGroupTitle>
      {navItems.map((item, i) => (
        <NavItem {...item} key={i} />
      ))}
    </Wrapper>
  )
}
