import { Text, UnstyledButton } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { Icon } from '@tabler/icons-react'
import { PermissionGate } from 'components/PermissionGate'
import { Link } from 'react-router-dom'

export interface ShortcutProps {
  title: string
  icon?: Icon
  color: string
  link: string
  permissions?: string | string[]
}
export const ShortcutCard: React.FC<ShortcutProps> = ({
  title,
  icon: Icon,
  color,
  link,
  permissions,
}) => {
  const { classes, theme } = useStyles()

  return (
    <PermissionGate permissions={permissions ?? []}>
      <UnstyledButton
        component={Link}
        to={`${link}`}
        p={'md'}
        key={title}
        className={classes.item}
      >
        {Icon && <Icon color={theme.colors[color][6]} size={32} />}
        <Text size={'md'} c={'dimmed'} fw={800} className={classes.text}>
          {title}
        </Text>
      </UnstyledButton>
    </PermissionGate>
  )
}

const useStyles = createStyles(theme => ({
  item: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${theme.colors.gray[2]}`,
    textAlign: 'center',
    borderRadius: theme.radius.md,
    height: 90,
    backgroundColor: theme.white,
    transition: 'box-shadow 150ms ease, transform 100ms ease',
  },
  text: {
    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      fontSize: theme.fontSizes.md,
    },
  },
}))
