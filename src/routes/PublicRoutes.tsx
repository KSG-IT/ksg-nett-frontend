import { ApplicantPortal } from 'modules/admissions'
import { ReSendApplicantTokenForm } from 'modules/admissions/components/ApplicantPortal'
import { LoginNew } from 'modules/login/views/LoginNew'
import { Route, Routes } from 'react-router-dom'

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="applicant-portal">
        <Route index element={<ReSendApplicantTokenForm />} />
        <Route path=":applicantToken" element={<ApplicantPortal />} />
      </Route>
      <Route path="login" element={<LoginNew />} />
      <Route path="*" element={<LoginNew />} />
    </Routes>
  )
}

export default PublicRoutes
