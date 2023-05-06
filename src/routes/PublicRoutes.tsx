import { ReSendApplicantTokenForm } from 'modules/admissions/components/ApplicantPortal'
import { ApplicantPortal } from 'modules/admissions/views'
import {
  ChangePasswordWithToken,
  ForgotPassword,
  Login,
  Authenticate,
} from 'modules/login/views'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="applicant-portal">
        <Route index element={<ReSendApplicantTokenForm />} />
        <Route path=":applicantToken" element={<ApplicantPortal />} />
      </Route>
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ChangePasswordWithToken />} />

      {/* authenticate endpoint is used to load a jwt token sent from backend emails to log in */}

      <Route
        path="authenticate"
        element={
          <ErrorBoundary
            FallbackComponent={() => <div>Oida, her gikk noe galt</div>}
          >
            <Authenticate />
          </ErrorBoundary>
        }
      />

      <Route path="login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default PublicRoutes
