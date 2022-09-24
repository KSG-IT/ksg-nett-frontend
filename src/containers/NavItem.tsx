import { createStyles, Text } from '@mantine/core'
import { TablerIcon } from '@tabler/icons'
import { Link } from 'react-router-dom'

export interface RouteItem {
  label: string
  link: string
  icon: TablerIcon
  onClick?: () => void
  permissions?: string | string[]
}

export const NavItem: React.FC<RouteItem & { active: boolean }> = props => {
  const { classes, cx } = useNavItemStyles({ active: props.active })
  return (
    <Link to={props.link} className={classes.navItem} onClick={props.onClick}>
      <props.icon className={cx(classes.icon)} data-active={props.active} />
      <Text className={classes.text}>{props.label}</Text>
    </Link>
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
