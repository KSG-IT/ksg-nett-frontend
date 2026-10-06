import { ReSendApplicantTokenForm } from 'modules/admissions/components/ApplicantPortal'
import { ApplicantPortal } from 'modules/admissions/views'
import {
  ChangePasswordWithToken,
  ForgotPassword,
  Login,
} from 'modules/login/views'
import { Route } from 'react-router-dom'
import { SentryRoutes } from './SentryRoutes'

const PublicRoutes: React.FC = () => {
  return (
    <SentryRoutes>
      <Route path="applicant-portal">
        <Route index element={<ReSendApplicantTokenForm />} />
        <Route path=":applicantToken" element={<ApplicantPortal />} />
      </Route>
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ChangePasswordWithToken />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </SentryRoutes>
  )
}

export default PublicRoutes
