import styled from 'styled-components'
import { NavItemProps, NavItem } from './NavItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`

const NavGroupTitle = styled.h5`
  margin: 0;
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
        <NavItem {...item} />
      ))}
    </Wrapper>
  )
}