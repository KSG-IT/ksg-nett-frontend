import { FullPage404 } from 'components/FullPageComponents'
import { PrivateRoute } from 'containers/PrivateRoute'
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
import { Redirect, Switch } from 'react-router-dom'
import { PERMISSIONS } from 'util/permissions'
import { GatedRoute } from './GatedRoute'

export const AuthRoutes: React.VFC = () => {
  return (
    <Switch>
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
      <PrivateRoute exact path="/users/manage" component={ManageUsers} />
      <PrivateRoute
        exact
        path="/users/manage/add-user"
        component={UserManagementAddUser}
      />

      <PrivateRoute exact path="/users/:userId" component={UserProfile} />

      {/* Admissions module */}
      <GatedRoute
        exact
        permissions={PERMISSIONS.admissions.view.admission}
        path="/admissions"
        component={AdmissionDashboard}
      />
      <GatedRoute
        exact
        path="/admissions/applicants-overview"
        permissions={PERMISSIONS.admissions.view.admission}
        component={ApplicantsOverview}
      />
      <GatedRoute
        exact
        path="/admissions/applicant-notices"
        permissions={PERMISSIONS.admissions.view.admission}
        component={ApplicantNotices}
      />

      <GatedRoute
        exact
        path="/admissions/internal-group-applicants/:internalGroupId"
        permissions={PERMISSIONS.admissions.view.admission}
        component={InternalGroupApplicants}
      />
      <GatedRoute
        exact
        permissions={PERMISSIONS.admissions.view.admission}
        path="/admissions/internal-group-discussion/:internalGroupId"
        component={InternalGroupDiscussion}
      />

      <GatedRoute
        exact
        permissions={PERMISSIONS.admissions.view.admission}
        path="/admissions/applicants/:applicantId"
        component={ApplicantDetails}
      />
      <GatedRoute
        exact
        permissions={PERMISSIONS.admissions.change.interview}
        path="/admissions/interviews/:interviewId/edit"
        component={EditInterview}
      />
      <GatedRoute
        exact
        permissions={PERMISSIONS.admissions.change.admission}
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

      <GatedRoute
        exact
        permissions={PERMISSIONS.admissions.change.admission}
        path="/admissions/close"
        component={CloseAdmission}
      />

      <Redirect from="/" to="/dashboard" />
      <Redirect exact from="/" to="/dashboard" />
    </Switch>
  )
}
