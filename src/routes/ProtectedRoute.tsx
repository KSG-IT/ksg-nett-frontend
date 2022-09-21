import { FullPageRestricted } from 'components/FullPageComponents'
import { usePermissions } from 'util/hooks/usePermissions'

interface ProtectedRouteProps {
  permissions: string | string[]
  children: React.ReactElement
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permissions,
  children,
}) => {
  const { hasPermissions } = usePermissions()
  const authorized = hasPermissions(permissions)

  return authorized ? children : <FullPageRestricted />
}
