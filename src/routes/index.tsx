import { useQuery } from '@apollo/client'
import { Center } from '@mantine/core'
import { FullContentLoader } from 'components/Loading'
import {
  AdmissionDashboard,
  ApplicantDetails,
  CloseAdmission,
  EditInterview,
} from 'modules/admissions'
import {
  ApplicantNotices,
  ApplicantsOverview,
  ConfigurationWizard,
  DiscussionDashboard,
  InternalGroupApplicants,
  InternalGroupDiscussion,
  MyInterviews,
} from 'modules/admissions/views'
import { Dashboard } from 'modules/dashboard/Dashboard'
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
import { MeQueryReturns, ME_QUERY, UserProfile } from 'modules/users'
import { ManageUsers } from 'modules/users/views'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useStore } from 'store'
import PublicRoutes from './public-routes'

const FullPage404 = React.lazy(
  () => import('components/FullPageComponents/FullPage404')
)

const MainContent = React.lazy(() => import('pages/MainContent'))

export const AppRoutes = () => {
  const { loading, error, data } = useQuery<MeQueryReturns>(ME_QUERY)
  const setUser = useStore(state => state.setUser)

  if (error) return <span>Error {error.message}</span>

  if (loading || data === undefined)
    return (
      <Center>
        <FullContentLoader />
      </Center>
    )

  const { me } = data
  if (me == null || me === undefined) {
    return <PublicRoutes />
  }
  setUser(me)

  return (
    <Routes>
      <Route path="/" element={<MainContent />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<p>Hello Events</p>} />
        <Route path="*" element={<FullPage404 />} />

        <Route path="summaries">
          <Route index element={<Summaries />} />
          <Route path="create" element={<CreateSummary />} />
          <Route path=":summaryId">
            <Route index element={<SummaryDetail />} />
            <Route path="edit" element={<EditSummary />} />
          </Route>
          <Route path="*" element={<FullPage404 />} />
        </Route>

        <Route path="internal-groups">
          <Route index element={<InternalGroups />} />
          <Route path=":internalGroupId" element={<InternalGroupDetail />} />
        </Route>

        <Route path="quotes">
          <Route index element={<QuotesList />} />
          <Route path="review" element={<ReviewQuotes />} />
          <Route path="popular" element={<PopularQuotes />} />
          <Route path="create" element={<CreateQuote />} />
        </Route>

        <Route path="users">
          <Route path=":userId" element={<UserProfile />} />
          <Route path="manage" element={<ManageUsers />} />
        </Route>

        <Route path="gallery">
          <Route index element={<p>Hello Gallery</p>} />
        </Route>

        <Route path="quiz">
          <Route index element={<p>Hello Quiz</p>} />
        </Route>

        <Route path="schedules">
          <Route index element={<p>Hello Schedules</p>} />
        </Route>

        <Route path="admissions">
          <Route index element={<AdmissionDashboard />} />
          <Route path="configure" element={<ConfigurationWizard />} />
          <Route path="my-interviews" element={<MyInterviews />} />
          <Route path="applicants-overview" element={<ApplicantsOverview />} />
          <Route path="applicant-notices" element={<ApplicantNotices />} />
          <Route path="close" element={<CloseAdmission />} />

          <Route path="internal-group-applicants">
            <Route
              path=":internalGroupId"
              element={<InternalGroupApplicants />}
            />
          </Route>

          <Route path="discussion-dashboard">
            <Route index element={<DiscussionDashboard />} />
            <Route
              path=":internalGroupId"
              element={<InternalGroupDiscussion />}
            />
          </Route>

          <Route path="applicants">
            <Route path=":applicantId" element={<ApplicantDetails />} />
          </Route>

          <Route path="interviews">
            <Route path=":interviewId">
              <Route path="edit" element={<EditInterview />} />
            </Route>
          </Route>
        </Route>

        <Route path="economy">
          <Route path="deposits" element={<Deposits />} />
          <Route path="me" element={<MyEconomy />} />
          <Route path="*" element={<FullPage404 />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}
