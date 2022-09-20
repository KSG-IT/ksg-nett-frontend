import { usePermissions } from 'util/hooks/usePermissions'

interface PermissionGateProps {
  permissions: string[] | string
  children: React.ReactNode
}
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permissions,
  children,
}) => {
  const { hasPermissions } = usePermissions()
  console.table(permissions)
  console.log(hasPermissions(permissions))
  const shouldRender = hasPermissions(permissions)
  if (!shouldRender) return null

  return <>{children}</>
}
