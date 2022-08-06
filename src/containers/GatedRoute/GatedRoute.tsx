import { PrivateRoute } from 'containers/PrivateRoute'
import { RouteProps } from 'react-router-dom'
import { usePermissions } from 'util/hooks/usePermissions'

interface GatedRouteProps extends RouteProps {
  permissions: string[] | string
}

export const GatedRoute: React.FC<GatedRouteProps> = ({
  component: Component,
  render,
  children,
  permissions,
  ...rest
}) => {
  const { hasPermissions } = usePermissions()
  const shouldRender = hasPermissions(permissions)
  if (!shouldRender) return <span>Du har ikke tilgang til denne siden</span>

  return <PrivateRoute component={Component} children={children} {...rest} />
}
