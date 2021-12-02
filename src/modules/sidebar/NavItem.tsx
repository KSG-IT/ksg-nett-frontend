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
  font-size: 16px;

  &:hover {
    background-color: ${props => props.theme.colors.purpleHover};
    color: ${props => props.theme.colors.white};
    cursor: pointer;
    font-weight: 600;
  }
`

const Badge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;

  width: 28px;
  height: 28px;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.purpleAction};
`

export interface NavItemProps {
  icon: IconName
  link?: string
  label: string
  notificationsCounter?: number
  onClick?: () => void
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  link = '',
  label,
  notificationsCounter = 0,
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
      <span style={{ margin: '0 0 0 12px' }}>{label}</span>{' '}
      {notificationsCounter > 0 ? <Badge>{notificationsCounter}</Badge> : null}
    </Wrapper>
  )
}
