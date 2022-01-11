import { PrivateRoute } from 'containers/PrivateRoute'
import { Dashboard } from 'modules/dashboard'
import { Deposits, MyEconomy } from 'modules/economy'
import { QuotesList } from 'modules/quotes'
import {
  CreateSummary,
  EditSummary,
  Summaries,
  SummaryDetail,
} from 'modules/summaries'
import { UserProfile } from 'modules/users'
import { useState } from 'react'
import { Redirect, Switch } from 'react-router-dom'

const PlaceholderComponent: React.FC = () => {
  const [sidebar, setSidebar] = useState(false)

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
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <PrivateRoute exact path="/quotes" component={QuotesList} />
      <PrivateRoute exact path="/schedules" component={PlaceholderComponent} />
      <PrivateRoute exact path="/economy" component={PlaceholderComponent} />
      <PrivateRoute exact path="/economy/me" component={MyEconomy} />
      <PrivateRoute exact path="/economy/deposits" component={Deposits} />
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

      <PrivateRoute exact path="/chat" component={PlaceholderComponent} />
      <PrivateRoute exact path="/users" component={PlaceholderComponent} />
      <PrivateRoute exact path="/users/:userId" component={UserProfile} />

      <Redirect from="/" to="/dashboard" />
      <Redirect exact from="/" to="/dashboard" />
    </Switch>
  )
}
