import { createStyles, Text } from '@mantine/core'
import { Icon } from '@tabler/icons-react'
import { PermissionGate } from 'components/PermissionGate'
import { Link } from 'react-router-dom'
import { useSidebar } from 'util/hooks'
export interface RouteItem {
  label: string
  link: string
  icon: Icon
  onClick?: () => void
  permissions: string | string[]
}

export const NavItem: React.FC<RouteItem & { active: boolean }> = props => {
  const { classes, cx } = useNavItemStyles({ active: props.active })

  const { toggleSidebar } = useSidebar()

  function handleClick() {
    props.onClick?.()
    toggleSidebar()
  }

  return (
    <PermissionGate permissions={props.permissions}>
      <Link to={props.link} className={classes.navItem} onClick={handleClick}>
        <props.icon
          className={cx(classes.icon)}
          data-active={props.active}
          size={16}
        />
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
    padding: `8px 4px`,
    backgroundColor: active ? t.colors.brand : t.colors.white,
    '&:hover': {
      backgroundColor: !active ? t.colors.red[0] : 'none',
    },
  },
}))
