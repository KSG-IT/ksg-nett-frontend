import { Switch, Redirect } from 'react-router-dom'
import { PrivateRoute } from 'containers/PrivateRoute'

const PlaceholderComponent: React.FC = () => {
  return <span>PLACEHOLDER</span>
}

export const AuthRoutes: React.FC = () => {
  return (
    <Switch>
      {/* Module routes */}
      <PrivateRoute exact path="/admissions" component={PlaceholderComponent} />
      <PrivateRoute exact path="/dashboard" component={PlaceholderComponent} />
      <PrivateRoute exact path="/quotes" component={PlaceholderComponent} />
      <PrivateRoute exact path="/schedules" component={PlaceholderComponent} />
      <PrivateRoute exact path="/economy" component={PlaceholderComponent} />
      <PrivateRoute exact path="/summaries" component={PlaceholderComponent} />
      <PrivateRoute exact path="/chat" component={PlaceholderComponent} />
      <PrivateRoute exact path="/users" component={PlaceholderComponent} />

      <Redirect from="/" to="/dashboard" />
      <Redirect exact from="/" to="/dashboard" />
    </Switch>
  )
}
