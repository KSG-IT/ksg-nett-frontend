import { Text } from '@mantine/core'
import { Icon } from '@tabler/icons-react'
import { PermissionGate } from 'components/PermissionGate'
import { Link } from 'react-router-dom'
import { useSidebar } from 'util/hooks'
import classes from './Navbar.module.css'

export interface RouteItem {
  label: string
  link: string
  icon: Icon
  onClick?: () => void
  permissions: string | string[]
}

export const NavItem: React.FC<RouteItem & { active: boolean }> = props => {
  const { toggleSidebar } = useSidebar()

  function handleClick() {
    props.onClick?.()
    toggleSidebar()
  }

  return (
    <PermissionGate permissions={props.permissions}>
      <Link
        to={props.link}
        className={classes.item}
        data-active={props.active || undefined}
        aria-current={props.active ? 'page' : undefined}
        onClick={handleClick}
      >
        <props.icon className={classes.icon} size={18} stroke={1.7} />
        <Text span inherit truncate>
          {props.label}
        </Text>
      </Link>
    </PermissionGate>
  )
}
