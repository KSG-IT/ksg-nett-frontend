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
  const { classes } = useStyles()

  return (
    <PermissionGate permissions={permissions ?? []}>
      <UnstyledButton
        component={Link}
        to={`${link}`}
        p={'md'}
        key={title}
        className={classes.item}
      >
        {Icon && <Icon color={`var(--mantine-color-${color}-6)`} size={32} />}
        <Text size={'md'} c={'dimmed'} fw={800} className={classes.text}>
          {title}
        </Text>
      </UnstyledButton>
    </PermissionGate>
  )
}

const useStyles = createStyles((_theme, _, u) => ({
  item: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--mantine-color-gray-2)',
    textAlign: 'center',
    borderRadius: 'var(--mantine-radius-md)',
    height: 90,
    backgroundColor: 'white',
    transition: 'box-shadow 150ms ease, transform 100ms ease',
  },
  text: {
    [u.smallerThan('xs')]: {
      fontSize: 'var(--mantine-font-size-md)',
    },
  },
}))
