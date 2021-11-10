import styled from 'styled-components'
import { Icon } from 'components/Icon'
import { NavLink } from 'react-router-dom'

const Wrapper = styled(NavLink)`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 30px;
  align-items: center;
  border-radius: 10px;
  text-decoration: none;
  color: black;
  font-size: 16px;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    cursor: pointer;
    font-weight: 600;
  }
`

export interface NavItemProps {
  icon: string
  link: string
  label: string
}

export const NavItem: React.FC<NavItemProps> = ({ icon, link, label }) => {
  return (
    <Wrapper to={link}>
      <Icon icon={icon} color="black" margin="0 12px 0 0" />
      <span>{label}</span>
    </Wrapper>
  )
}
