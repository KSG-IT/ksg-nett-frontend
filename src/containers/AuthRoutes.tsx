import { FullPage404 } from 'components/FullPageComponents'
import { PrivateRoute } from 'containers/PrivateRoute'
import { AdmissionDashboard } from 'modules/admissions'
import { ConfigurationWizard } from 'modules/admissions/ConfigureAdmission'
import { InterviewOverview } from 'modules/admissions/ConfigureAdmission/InterviewOverview'
import { Dashboard } from 'modules/dashboard'
import { Deposits, MyEconomy } from 'modules/economy'
import {
  CreateQuote,
  PopularQuotes,
  QuotesList,
  ReviewQuotes,
} from 'modules/quotes'
import {
  CreateSummary,
  EditSummary,
  Summaries,
  SummaryDetail,
} from 'modules/summaries'
import { UserProfile } from 'modules/users'
import { Redirect, Switch } from 'react-router-dom'

export const AuthRoutes: React.VFC = () => {
  return (
    <Switch>
      {/* Module routes */}
      <PrivateRoute exact path="/dashboard" component={Dashboard} />

      {/* Events module */}
      <PrivateRoute exact path="/events" component={FullPage404} />
      <PrivateRoute exact path="/events/eventId" component={FullPage404} />

      {/* Quotes module */}
      <PrivateRoute exact path="/quotes" component={QuotesList} />
      <PrivateRoute exact path="/quotes/create" component={CreateQuote} />
      <PrivateRoute exact path="/quotes/review" component={ReviewQuotes} />
      <PrivateRoute exact path="/quotes/popular" component={PopularQuotes} />

      {/* Internal groups module */}
      <PrivateRoute exact path="/internal-groups" component={FullPage404} />
      <PrivateRoute
        exact
        path="/internal-groups/:internalGroupId"
        component={FullPage404}
      />

      {/* Schedules module */}
      <PrivateRoute exact path="/schedules" component={FullPage404} />

      {/* Economy module */}
      <PrivateRoute exact path="/economy" component={FullPage404} />
      <PrivateRoute exact path="/economy/me" component={MyEconomy} />
      <PrivateRoute exact path="/economy/deposits" component={Deposits} />

      {/* Summaries module */}
      <PrivateRoute exact path="/summaries" component={Summaries} />
      <PrivateRoute exact path="/summaries/create" component={CreateSummary} />
      <PrivateRoute
        exact
        path="/summaries/:summaryId"
        component={SummaryDetail}
      />
      <PrivateRoute
        exact
        path="/summaries/:summaryId/edit"
        component={EditSummary}
      />

      {/* Users module */}
      <PrivateRoute exact path="/users" component={FullPage404} />
      <PrivateRoute exact path="/users/:userId" component={UserProfile} />

      {/* Admissions module */}
      <PrivateRoute exact path="/admissions" component={AdmissionDashboard} />
      <PrivateRoute
        exact
        path="/admissions/config"
        component={ConfigurationWizard}
      />
      <PrivateRoute
        exact
        path="/admissions/config/interview-schedule"
        component={FullPage404}
      />
      <PrivateRoute
        exact
        path="/admissions/config/interview-location-availability"
        component={FullPage404}
      />
      <PrivateRoute
        exact
        path="/admissions/config/interview-overview"
        component={InterviewOverview}
      />
      <PrivateRoute
        exact
        path="/admissions/:admissionId"
        component={FullPage404}
      />

      <Redirect from="/" to="/dashboard" />
      <Redirect exact from="/" to="/dashboard" />
    </Switch>
  )
}
