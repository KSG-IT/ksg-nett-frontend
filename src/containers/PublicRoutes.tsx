import { ApplicantPortal } from 'modules/admissions/ApplicantPortal'
import { Login } from 'modules/login'
import { FC } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

export const PublicRoutes: FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route
          exact
          path="/applicant-portal/:applicantToken"
          component={ApplicantPortal}
        />
        <Redirect from="" to="/login" />
      </Switch>
    </Router>
  )
}
