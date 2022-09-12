import { FullPage404 } from 'components/FullPageComponents'
import { Route } from 'containers/Route'
import { ApplicantDetails } from 'modules/admissions'
import {
  AdmissionDashboard,
  ApplicantNotices,
  ApplicantsOverview,
  CloseAdmission,
  ConfigurationWizard,
  DiscussionDashboard,
  EditInterview,
  InternalGroupApplicants,
  InternalGroupDiscussion,
  MyInterviews,
} from 'modules/admissions/views'
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
import { UserManagementAddUser } from 'modules/users/UserManagement'
import { ManageUsers } from 'modules/users/views'
import { PERMISSIONS } from 'util/permissions'

export const AuthRoutes: React.VFC = () => {
  return (
    <Switch>
      <Route exact path="/dashboard" component={Dashboard} />

      {/* Events module */}
      <Route path="/events" component={FullPage404} />
      <Route path="/events/eventId" component={FullPage404} />

      {/* Quotes module */}
      <Route path="/quotes" component={QuotesList} />
      <Route path="/quotes/create" component={CreateQuote} />
      <Route path="/quotes/review" component={ReviewQuotes} />
      <Route path="/quotes/popular" component={PopularQuotes} />

      {/* Internal groups module */}
      <Route path="/internal-groups" component={InternalGroups} />
      <Route
        path="/internal-groups/:internalGroupId"
        component={InternalGroupDetail}
      />

      {/* Schedules module */}

      <Route path="/schedules" component={FullPage404} />

      {/* Economy module */}
      <Route path="/economy" component={FullPage404} />
      <Route path="/economy/me" component={MyEconomy} />
      <Route path="/economy/me/purchase-history" component={FullPage404} />
      <Route exact path="/economy/me/deposit-history" component={FullPage404} />
      <Route exact path="/economy/deposits" component={Deposits} />

      {/* Summaries module */}
      <Route exact path="/summaries" component={Summaries} />
      <Route exact path="/summaries/create" component={CreateSummary} />
      <Route exact path="/summaries/:summaryId" component={SummaryDetail} />
      <Route exact path="/summaries/:summaryId/edit" component={EditSummary} />

      {/* Users module */}
      <Route exact path="/users/manage" component={ManageUsers} />
      <Route
        exact
        path="/users/manage/add-user"
        component={UserManagementAddUser}
      />

      <Route exact path="/users/:userId" component={UserProfile} />

      {/* Admissions module */}
      <Route
        exact
        permissions={PERMISSIONS.admissions.view.admission}
        path="/admissions"
        component={AdmissionDashboard}
      />
      <Route
        exact
        path="/admissions/applicants-overview"
        permissions={PERMISSIONS.admissions.view.admission}
        component={ApplicantsOverview}
      />
      <Route
        exact
        path="/admissions/applicant-notices"
        permissions={PERMISSIONS.admissions.view.admission}
        component={ApplicantNotices}
      />

      <Route
        exact
        path="/admissions/internal-group-applicants/:internalGroupId"
        permissions={PERMISSIONS.admissions.view.admission}
        component={InternalGroupApplicants}
      />
      <Route
        exact
        permissions={PERMISSIONS.admissions.view.admission}
        path="/admissions/internal-group-discussion/:internalGroupId"
        component={InternalGroupDiscussion}
      />

      <Route
        exact
        permissions={PERMISSIONS.admissions.view.admission}
        path="/admissions/applicants/:applicantId"
        component={ApplicantDetails}
      />
      <Route
        exact
        permissions={PERMISSIONS.admissions.change.interview}
        path="/admissions/interviews/:interviewId/edit"
        component={EditInterview}
      />
      <Route
        exact
        permissions={PERMISSIONS.admissions.change.admission}
        path="/admissions/config"
        component={ConfigurationWizard}
      />
      <Route exact path="/admissions/my-interviews" component={MyInterviews} />

      <Route
        exact
        path="/admissions/discussion-dashboard"
        component={DiscussionDashboard}
      />

      <Route
        exact
        permissions={PERMISSIONS.admissions.change.admission}
        path="/admissions/close"
        component={CloseAdmission}
      />

      <Route
        path="about"
        render={() => <Redirect from="/" to="/dashboard" />}
      />
      <Route
        path="about"
        render={() => <Redirect exact from="/" to="/dashboard" />}
      />
    </Switch>
  )
}
