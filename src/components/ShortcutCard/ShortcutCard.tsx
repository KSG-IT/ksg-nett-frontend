import { createStyles, Text, UnstyledButton } from '@mantine/core'
import { TablerIcon } from '@tabler/icons'
import { PermissionGate } from 'components/PermissionGate'
import { Link } from 'react-router-dom'

export interface ShortcutProps {
  title: string
  icon?: TablerIcon
  color?: string
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
        {Icon && (
          <Icon
            color={
              color
                ? theme.colors[color][6]
                : theme.colors[theme.primaryColor][theme.primaryShade as number]
            }
            size={32}
          />
        )}
        <Text
          size={'md'}
          color={'dimmed'}
          weight={800}
          className={classes.text}
        >
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
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.white,
    transition: 'box-shadow 150ms ease, transform 100ms ease',

    '&:hover': {
      boxShadow: `${theme.shadows.sm} !important`,
      transform: 'scale(1.05)',
    },
  },
  text: {
    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      fontSize: theme.fontSizes.md,
    },
  },
}))
