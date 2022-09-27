import { ApplicantPortal } from 'modules/admissions'
import { ReSendApplicantTokenForm } from 'modules/admissions/components/ApplicantPortal'
import { Login } from 'modules/login/views'
import { Route, Routes } from 'react-router-dom'

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="applicant-portal">
        <Route index element={<ReSendApplicantTokenForm />} />
        <Route path=":applicantToken" element={<ApplicantPortal />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default PublicRoutes
