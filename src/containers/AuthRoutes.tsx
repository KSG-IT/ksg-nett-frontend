import { Switch, Redirect } from 'react-router-dom'
import { useState } from 'react'
import { PrivateRoute } from 'containers/PrivateRoute'

const PlaceholderComponent: React.FC = () => {
  const [sidebar, setSidebar] = useState(false)
  console.log(sidebar)

  const toggleSidebar = () => {
    setSidebar(!sidebar)
  }
  return (
    <div>
      <span>Sidebar is {sidebar ? 'open' : 'closed'}</span>
      <br />
      <button onClick={toggleSidebar}>Toggle</button>
    </div>
  )
}

export const AuthRoutes: React.FC = () => {
  return (
    <Switch>
      {/* Module routes */}
      <PrivateRoute
        exact
        path="/admissiosns"
        component={PlaceholderComponent}
      />
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
