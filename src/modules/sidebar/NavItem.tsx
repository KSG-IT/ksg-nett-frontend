import { IconName } from '@fortawesome/fontawesome-common-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PermissionGate } from 'components/PermissionGate'
import { NavLink } from 'react-router-dom'
import { useStore } from 'store'
import styled from 'styled-components'

const Wrapper = styled(NavLink)`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 35px;
  align-items: center;
  text-decoration: none;
  font-size: 16px;
  padding-left: 15px;

  ${props =>
    props.isActive
      ? `background-color: ${props.theme.colors.purpleAction}`
      : ''}

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

  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.purpleAction};
`

export interface NavItemProps {
  icon: IconName
  link?: string
  label: string
  notificationsCounter?: number
  permissions?: string[] | string
  onClick?: () => void
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  link = '',
  label,
  notificationsCounter = 0,
  permissions = [],
  onClick = () => {},
}) => {
  const toggleSidebarOpen = useStore(state => state.toggleSidebarOpen)

  const handleOnClick = () => {
    onClick()
    toggleSidebarOpen()
  }
  return (
    <PermissionGate permissions={permissions}>
      <Wrapper to={link} onClick={handleOnClick}>
        <FontAwesomeIcon
          icon={['fas', icon]}
          color="inherit"
          size="1x"
          type="regular"
          cursor="inherit"
        />
        <span style={{ margin: '0 5px 0 12px' }}>{label}</span>{' '}
        {notificationsCounter > 0 ? (
          <Badge>{notificationsCounter}</Badge>
        ) : null}
      </Wrapper>
    </PermissionGate>
  )
}
