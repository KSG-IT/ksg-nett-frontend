import { FC } from 'react'
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'
import { Login } from 'modules/login'

export const PublicRoutes: FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Redirect from="" to="/login" />
      </Switch>
    </Router>
  )
}
