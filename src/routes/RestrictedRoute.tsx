import { FullPageRestricted } from 'components/FullPageComponents'
import { usePermissions } from 'util/hooks/usePermissions'

interface RestrictedRouteProps {
  permissions: string | string[]
  children: React.ReactElement
}

export const RestrictedRoute: React.FC<RestrictedRouteProps> = ({
  permissions,
  children,
}) => {
  const { hasPermissions } = usePermissions()
  const authorized = hasPermissions(permissions)

  return authorized ? children : <FullPageRestricted />
}
