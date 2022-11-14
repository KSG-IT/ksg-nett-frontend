import { createStyles, Text } from '@mantine/core'
import { TablerIcon } from '@tabler/icons'
import { PermissionGate } from 'components/PermissionGate'
import { Link } from 'react-router-dom'
import { useStore } from 'store'

export interface RouteItem {
  label: string
  link: string
  icon: TablerIcon
  onClick?: () => void
  permissions: string | string[]
}

export const NavItem: React.FC<RouteItem & { active: boolean }> = props => {
  const { classes, cx } = useNavItemStyles({ active: props.active })
  const toggle = useStore(state => state.toggleSidebarOpen)
  function handleClick() {
    props.onClick && props.onClick()
    toggle()
  }
  return (
    <PermissionGate permissions={props.permissions}>
      <Link to={props.link} className={classes.navItem} onClick={handleClick}>
        <props.icon className={cx(classes.icon)} data-active={props.active} />
        <Text className={classes.text}>{props.label}</Text>
      </Link>
    </PermissionGate>
  )
}

const useNavItemStyles = createStyles((t, { active }: { active: boolean }) => ({
  icon: {
    color: active ? t.colors.white : t.colors.gray[6],
    marginRight: t.spacing.sm,
  },
  text: {
    fontWeight: 600,
    color: active ? t.colors.white : t.colors.gray[6],
  },
  navItem: {
    display: 'flex',
    width: '100%',
    borderRadius: t.radius.sm,
    padding: `${t.spacing.xs}px ${t.spacing.sm}px`,
    backgroundColor: active ? t.colors.brand : t.colors.white,
    '&:hover': {
      backgroundColor: !active ? t.colors.red[0] : 'none',
    },
  },
}))
