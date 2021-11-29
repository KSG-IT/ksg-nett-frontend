import { Route, Redirect } from 'react-router-dom'
import { RouteProps, RouteComponentProps } from 'react-router-dom'
import { IS_LOGGED_IN_QUERY } from 'modules/login/queries'
import { IsLoggedInQueryReturn } from 'modules/login/types'
import { useQuery } from '@apollo/client'

// Extend this to also accept permission checks?
export const PrivateRoute: React.FC<RouteProps> = ({
  component: Component,
  render,
  children,
  ...rest
}) => {
  const { loading, data } = useQuery<IsLoggedInQueryReturn>(
    IS_LOGGED_IN_QUERY,
    {
      onError: () => {
        console.error(
          'Could not verify if user is logged in, redirecting to login'
        )
        return <Redirect to="login" />
      },
      pollInterval: 6000,
    }
  )

  if (loading || !data) {
    return null
  }
  let renderComponent: (props: RouteComponentProps<any>) => React.ReactNode
  if (typeof Component !== 'undefined') {
    renderComponent = props =>
      isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
  } else if (typeof render !== 'undefined') {
    renderComponent = props =>
      isLoggedIn ? render(props) : <Redirect to="/login" />
  } else {
    throw new Error('Either component or render must be passed.')
  }
  const { isLoggedIn } = data
  return <Route {...rest} render={renderComponent} />
}
