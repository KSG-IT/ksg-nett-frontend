import { usePermissions } from 'util/hooks/usePermissions'

interface PermissionGateProps {
  permissions: string[] | string
}
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permissions,
  children,
}) => {
  const { hasPermissions } = usePermissions()
  const shouldRender = hasPermissions(permissions)
  if (!shouldRender) return null

  return <>{children}</>
}
