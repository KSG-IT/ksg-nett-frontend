import { ReSendApplicantTokenForm } from 'modules/admissions/components/ApplicantPortal/ReSendApplicantTokenForm'
import { ApplicantPortal } from 'modules/admissions/views'
import { Login } from 'modules/login'
import { Toaster } from 'react-hot-toast'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

export const PublicRoutes: React.VFC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route
          exact
          path="/applicant-portal"
          component={ReSendApplicantTokenForm}
        />
        <Route
          exact
          path="/applicant-portal/:applicantToken"
          component={ApplicantPortal}
        />
        <Redirect from="" to="/login" />
      </Switch>
      <Toaster />
    </Router>
  )
}
