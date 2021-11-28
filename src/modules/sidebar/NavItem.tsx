import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { IconName } from '@fortawesome/fontawesome-common-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Wrapper = styled(NavLink)`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 30px;
  align-items: center;
  border-radius: 10px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background-color: ${props => props.theme.colors.purpleHover};
    color: ${props => props.theme.colors.white};
    cursor: pointer;
    font-weight: 600;
  }
`

export interface NavItemProps {
  icon: IconName
  link?: string
  label: string
  onClick?: () => void
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  link = '',
  label,
  onClick,
}) => {
  return (
    <Wrapper to={link} onClick={onClick}>
      <FontAwesomeIcon
        icon={['fas', icon]}
        color="inherit"
        size="sm"
        type="regular"
        cursor="inherit"
      />
      <span style={{ margin: '0 0 0 12px' }}>{label}</span>
    </Wrapper>
  )
}
