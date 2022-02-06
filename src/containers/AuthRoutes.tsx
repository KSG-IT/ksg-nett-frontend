import { Switch, Redirect } from 'react-router-dom'
import { PrivateRoute } from 'containers/PrivateRoute'
import { Breadcrumbs } from './BreadCrumbs'
import { privateRoutes } from './privateRoutes'


export const AuthRoutes: React.FC = () => {
  return (
    <Switch>
      {/* Module routes */}
      {privateRoutes.map(({ path, Component }, key) => (
        <PrivateRoute exact path={path} key={key}
        render={props => {
          const crumbs = privateRoutes
            // Get all routes that contain the current one.
            .filter(({ path }) => props.match.path.includes(path as string))
            // Swap out any dynamic routes with their param values.
            // E.g. "/pizza/:pizzaId" will become "/pizza/1"
            .map(({ path, ...rest }) => ({
              path: Object.keys(props.match.params).length
                ? Object.keys(props.match.params).reduce(
                   (path, param) => 
                   path?.replace(`:${param}`, (props.match.params[param] as string)), 
                     path
                  )
                : path,
              ...rest
            })); 
            crumbs.map(({ name, path }) => console.log({ name, path }));

            return (
              <div className="p-8">
                  <Breadcrumbs crumbs={crumbs} />
                  {!!Component && 
                  <Component {...props} />
                }
                </div>
              );
            }}
          />
        ))}
            )
      <Redirect from="/" to="/dashboard" />
      <Redirect exact from="/" to="/dashboard" />
    </Switch>
  )
}
