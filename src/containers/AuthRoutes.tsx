import { FullPage404 } from 'components/FullPageComponents'
import { PrivateRoute } from 'containers/PrivateRoute'
import { ApplicantDetails } from 'modules/admissions'
import { AdmissionDashboard } from 'modules/admissions/AdmissionDashboard'
import { CloseAdmission } from 'modules/admissions/CloseAdmission'
import { ConfigurationWizard } from 'modules/admissions/ConfigureAdmission'
import { DiscussionDashboard } from 'modules/admissions/DiscussionDashboard'
import { InternalGroupDiscussion } from 'modules/admissions/DiscussionDashboard/InternalGroupDiscussion'
import { InternalGroupApplicants } from 'modules/admissions/InternalGroupApplicants'
import { InterviewEdit } from 'modules/admissions/InterviewEdit/InterviewEdit'
import { MyInterviews } from 'modules/admissions/MyInterviews'
import { Dashboard } from 'modules/dashboard'
import { Deposits, MyEconomy } from 'modules/economy'
import { InternalGroupDetail } from 'modules/organization/InternalGroupDetail'
import { InternalGroups } from 'modules/organization/InternalGroups'
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
import {
  UserManagement,
  UserManagementAddUser,
} from 'modules/users/UserManagement'
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
      <PrivateRoute exact path="/internal-groups" component={InternalGroups} />
      <PrivateRoute
        exact
        path="/internal-groups/:internalGroupId"
        component={InternalGroupDetail}
      />

      {/* Schedules module */}

      <PrivateRoute exact path="/schedules" component={FullPage404} />

      {/* Economy module */}
      <PrivateRoute exact path="/economy" component={FullPage404} />
      <PrivateRoute exact path="/economy/me" component={MyEconomy} />
      <PrivateRoute
        exact
        path="/economy/me/purchase-history"
        component={FullPage404}
      />
      <PrivateRoute
        exact
        path="/economy/me/deposit-history"
        component={FullPage404}
      />
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
      <PrivateRoute exact path="/users/manage" component={UserManagement} />
      <PrivateRoute
        exact
        path="/users/manage/add-user"
        component={UserManagementAddUser}
      />

      <PrivateRoute exact path="/users/:userId" component={UserProfile} />
      <PrivateRoute exact path="/users/newbies" component={FullPage404} />

      {/* Admissions module */}
      <PrivateRoute exact path="/admissions" component={AdmissionDashboard} />
      <PrivateRoute
        exact
        path="/admissions/internal-group-applicants/:internalGroupId"
        component={InternalGroupApplicants}
      />
      <PrivateRoute
        exact
        path="/admissions/internal-group-discussion/:internalGroupId"
        component={InternalGroupDiscussion}
      />

      <PrivateRoute
        exact
        path="/admissions/applicants/:applicantId"
        component={ApplicantDetails}
      />
      <PrivateRoute
        exact
        path="/admissions/interviews/:interviewId/edit"
        component={InterviewEdit}
      />
      <PrivateRoute
        exact
        path="/admissions/config"
        component={ConfigurationWizard}
      />
      <PrivateRoute
        exact
        path="/admissions/my-interviews"
        component={MyInterviews}
      />

      <PrivateRoute
        exact
        path="/admissions/discussion-dashboard"
        component={DiscussionDashboard}
      />

      <PrivateRoute exact path="/admissions/close" component={CloseAdmission} />
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
