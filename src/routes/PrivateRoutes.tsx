import { useQuery } from '@apollo/client'
import { Center } from '@mantine/core'
import * as Sentry from '@sentry/react'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  AdmissionDashboard,
  ApplicantDetails,
  ApplicantNotices,
  ApplicantsOverview,
  CloseAdmission,
  ConfigurationWizard,
  DiscussionDashboard,
  EditInterview,
  FinishedInterviews,
  InternalGroupApplicants,
  InternalGroupDiscussion,
  InterviewsOverview,
  MyInterviews,
} from 'modules/admissions/views'
import {
  BarTabCustomers,
  BarTabDashboard,
  PreviousBarTabs,
} from 'modules/barTab/views'
import { Dashboard } from 'modules/dashboard/Dashboard'
import {
  CreateDeposit,
  DebtCollection,
  Deposits,
  MyEconomy,
  SociOrderSession,
  SociSessionDetail,
  SosiSessions,
} from 'modules/economy/views'
import { CreateDocument } from 'modules/handbook/views/CreateDocument'
import {
  InternalGroupDetail,
  InternalGroups,
  ManageInternalGroup,
} from 'modules/organization/views'
import {
  CreateQuote,
  PopularQuotes,
  QuotesList,
  ReviewQuotes,
} from 'modules/quotes/views'
import {
  AllMyShifts,
  AllShifts,
  MyAvailability,
  MyUpcomingShifts,
  ScheduleDetails,
  Schedules,
  ScheduleTemplateDetails,
  ScheduleTemplates,
} from 'modules/schedules/views'
import { CreateSummary, Summaries, SummaryDetail } from 'modules/summaries'
import { ME_QUERY } from 'modules/users/queries'
import { MeQueryReturns } from 'modules/users/types'
import {
  MigrationWizard,
  UserProfile,
  UserTypeDetail,
  UserTypes,
} from 'modules/users/views'
import { FirstTimeLogin } from 'modules/users/views/FirstTImeLogin'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useStore } from 'store'
import { PERMISSIONS } from 'util/permissions'
import PublicRoutes from './PublicRoutes'
import { RestrictedRoute } from './RestrictedRoute'
import { SociStatistics } from '../modules/economy/views/SociStatistics'

const FullPage404 = React.lazy(
  () => import('components/FullPageComponents/FullPage404')
)

const MainContent = React.lazy(() => import('routes/MainContent'))

// ==== Handbook ====
const Handbook = React.lazy(() => import('modules/handbook/views/Handbook'))
const DocumentDetail = React.lazy(
  () => import('modules/handbook/views/DocumentDetail')
)

// ==== Admissions ====
const AdmissionStatistics = React.lazy(
  () => import('modules/admissions/views/AdmissionStatistics')
)
// ==== Users ====
const MySettings = React.lazy(() => import('modules/users/views/MySettings'))
const Newbies = React.lazy(() => import('modules/users/views/Newbies'))

// ==== Feature flags ====
const FeatureFlags = React.lazy(
  () => import('modules/featureFlags/views/FeatureFlags')
)

const EconomyDashboard = React.lazy(
  () => import('modules/economy/views/EconomyDashboard')
)
export const AppRoutes: React.FC = () => {
  const { loading, error, data } = useQuery<MeQueryReturns>(ME_QUERY)
  const setUser = useStore(state => state.setUser)

  if (error) return <FullPageError />

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

  Sentry.setUser({ email: me.email, id: me.id, username: me.fullName })
  setUser(me)

  if (me.firstTimeLogin) {
    return (
      <Routes>
        <Route path="registration" element={<FirstTimeLogin />} />
        <Route path="*" element={<Navigate to="/registration" />} />
      </Routes>
    )
  }

  if (me.requiresMigrationWizard) {
    return (
      <Routes>
        <Route path="migration-wizard" element={<MigrationWizard />} />
        <Route path="*" element={<Navigate to="/migration-wizard" />} />
      </Routes>
    )
  }

  if (me.owesMoney) {
    return (
      <Routes>
        <Route path="torpedo" element={<DebtCollection />} />
        <Route path="*" element={<Navigate to="/torpedo" />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<MainContent />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<FullPage404 />} />

        {/* ==== BAR TAB MODULE ==== */}
        <Route path="bar-tab">
          <Route
            index
            element={
              <RestrictedRoute permissions={PERMISSIONS.barTab.view.barTab}>
                <BarTabDashboard />
              </RestrictedRoute>
            }
          />

          <Route
            path="previous"
            element={
              <RestrictedRoute permissions={PERMISSIONS.barTab.view.barTab}>
                <PreviousBarTabs />
              </RestrictedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.barTab.view.barTabCustomer}
              >
                <BarTabCustomers />
              </RestrictedRoute>
            }
          />
        </Route>

        {/* ==== SUMMARY MODULE ==== */}
        <Route path="summaries">
          <Route index element={<Summaries />} />
          <Route
            path="create"
            element={
              <RestrictedRoute permissions={PERMISSIONS.summaries.add.summary}>
                <CreateSummary />
              </RestrictedRoute>
            }
          />
          <Route path=":summaryId">
            <Route index element={<SummaryDetail />} />
          </Route>
          <Route path="*" element={<FullPage404 />} />
        </Route>
        {/* ==== INTERNAL GROUPS MODULE ==== */}
        <Route path="internal-groups">
          <Route index element={<InternalGroups />} />
          <Route path=":internalGroupId">
            <Route index element={<InternalGroupDetail />} />
            <Route
              path="manage"
              element={
                <RestrictedRoute
                  permissions={
                    PERMISSIONS.organization.change
                      .internalGroupPositionMembership
                  }
                >
                  <ManageInternalGroup />
                </RestrictedRoute>
              }
            />
          </Route>
        </Route>

        {/* ==== QUOTES MODULE ==== */}
        <Route path="quotes">
          <Route path="popular" element={<PopularQuotes />} />
          <Route index element={<QuotesList />} />
          <Route
            path="review"
            element={
              <RestrictedRoute permissions={PERMISSIONS.quotes.approve.quote}>
                <ReviewQuotes />
              </RestrictedRoute>
            }
          />
          <Route path="popular" element={<PopularQuotes />} />
          <Route path="create" element={<CreateQuote />} />
        </Route>

        {/* ==== HANDBOOK MODULE ==== */}
        <Route path="handbook">
          <Route index element={<Handbook />} />
          <Route path={'create'} element={<CreateDocument />} />
          <Route path="document">
            <Route path=":documentId" element={<DocumentDetail />} />
          </Route>
        </Route>

        {/* ==== USERS MODULE ==== */}
        <Route path="users">
          <Route path="me" element={<MySettings />} />
          <Route path=":userId" element={<UserProfile />} />
          <Route path="newbies" element={<Newbies />} />
          <Route path="user-types">
            <Route
              index
              element={
                <RestrictedRoute permissions={PERMISSIONS.users.view.userType}>
                  <UserTypes />
                </RestrictedRoute>
              }
            />
            <Route
              path=":userTypeId"
              element={
                <RestrictedRoute permissions={PERMISSIONS.users.view.userType}>
                  <UserTypeDetail />
                </RestrictedRoute>
              }
            />
          </Route>
        </Route>

        {/* ==== ADMISSIONS MODULE ==== */}
        <Route path="admissions">
          <Route
            index
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.admissions.view.admission}
              >
                <AdmissionDashboard />
              </RestrictedRoute>
            }
          />
          <Route
            path="configure"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.admissions.change.admission}
              >
                <ConfigurationWizard />
              </RestrictedRoute>
            }
          />
          <Route
            path="my-interviews"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.admissions.view.admission}
              >
                <MyInterviews />
              </RestrictedRoute>
            }
          />

          <Route
            path="applicants-overview"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.admissions.view.admission}
              >
                <ApplicantsOverview />
              </RestrictedRoute>
            }
          />
          <Route
            path="applicant-notices"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.admissions.view.admission}
              >
                <ApplicantNotices />
              </RestrictedRoute>
            }
          />
          <Route
            path="interviews-overview"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.admissions.view.interview}
              >
                <InterviewsOverview />
              </RestrictedRoute>
            }
          />
          <Route
            path="finished-interviews"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.admissions.view.interview}
              >
                <FinishedInterviews />
              </RestrictedRoute>
            }
          />
          <Route
            path="statistics"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.admissions.view.interview}
              >
                <AdmissionStatistics />
              </RestrictedRoute>
            }
          />

          <Route
            path="close"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.admissions.view.admission}
              >
                <CloseAdmission />
              </RestrictedRoute>
            }
          />

          <Route path="internal-group">
            <Route
              path=":internalGroupId"
              element={<InternalGroupApplicants />}
            />
          </Route>

          <Route path="discussion-dashboard">
            <Route
              index
              element={
                <RestrictedRoute
                  permissions={PERMISSIONS.admissions.view.admission}
                >
                  <DiscussionDashboard />
                </RestrictedRoute>
              }
            />
            <Route
              path=":internalGroupId"
              element={
                <RestrictedRoute
                  permissions={PERMISSIONS.admissions.view.admission}
                >
                  <InternalGroupDiscussion />
                </RestrictedRoute>
              }
            />
          </Route>

          <Route path="applicants">
            <Route
              path=":applicantId"
              element={
                <RestrictedRoute
                  permissions={PERMISSIONS.admissions.view.admission}
                >
                  <ApplicantDetails />
                </RestrictedRoute>
              }
            />
          </Route>

          <Route path="interviews">
            <Route path=":interviewId">
              <Route
                path="edit"
                element={
                  <RestrictedRoute
                    permissions={PERMISSIONS.admissions.view.admission}
                  >
                    <EditInterview />
                  </RestrictedRoute>
                }
              />
            </Route>
          </Route>
        </Route>

        {/* ==== ECONOMY MODULE ==== */}
        <Route path="economy">
          <Route
            index
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.economy.view.sociSession}
              >
                <EconomyDashboard />
              </RestrictedRoute>
            }
          />
          <Route path="deposits">
            <Route
              index
              element={
                <RestrictedRoute
                  permissions={PERMISSIONS.economy.approve.deposit}
                >
                  <Deposits />
                </RestrictedRoute>
              }
            />
            <Route path="create" element={<CreateDeposit />} />
          </Route>
          <Route path="me" element={<MyEconomy />} />
          <Route path="soci-products" element={<h2>Suh duh</h2>} />
          <Route path={'statistics'} element={<SociStatistics />} />

          <Route path="soci-sessions">
            <Route
              index
              element={
                <RestrictedRoute
                  permissions={PERMISSIONS.economy.view.sociSession}
                >
                  <SosiSessions />
                </RestrictedRoute>
              }
            />
            <Route path="live" element={<SociOrderSession />} />

            <Route
              path=":id"
              element={
                <RestrictedRoute
                  permissions={PERMISSIONS.economy.view.sociSession}
                >
                  <SociSessionDetail />
                </RestrictedRoute>
              }
            />
          </Route>
          <Route path="*" element={<FullPage404 />} />
        </Route>

        {/* ==== FEATURE FLAGS MODULE ==== */}
        <Route
          path="feature-flags"
          element={
            <RestrictedRoute
              permissions={PERMISSIONS.featureFlags.view.featureFlag}
            >
              <FeatureFlags />
            </RestrictedRoute>
          }
        />

        {/* ==== SCHEDULES MODULE ==== */}
        <Route path="schedules">
          <Route
            index
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.schedules.change.schedule}
              >
                <Schedules />
              </RestrictedRoute>
            }
          />
          <Route
            path=":id"
            element={
              <RestrictedRoute
                permissions={PERMISSIONS.schedules.change.schedule}
              >
                <ScheduleDetails />
              </RestrictedRoute>
            }
          />
          <Route path="me">
            <Route index element={<MyUpcomingShifts />} />
            <Route path="history" element={<AllMyShifts />} />
            <Route path="availability" element={<MyAvailability />} />
          </Route>
          <Route path="all-shifts" element={<AllShifts />} />

          <Route path="templates">
            <Route
              index
              element={
                <RestrictedRoute
                  permissions={PERMISSIONS.schedules.view.scheduleTemplate}
                >
                  <ScheduleTemplates />
                </RestrictedRoute>
              }
            />
            <Route path=":templateId">
              <Route
                index
                element={
                  <RestrictedRoute
                    permissions={PERMISSIONS.schedules.view.scheduleTemplate}
                  >
                    <ScheduleTemplateDetails />
                  </RestrictedRoute>
                }
              />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}
