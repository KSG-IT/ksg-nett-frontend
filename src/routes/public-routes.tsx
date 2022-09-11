import { Login } from 'modules/login'
import { Route } from 'react-router-dom'

const PublicRoutes = () => {
  return (
    <>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/applicant-portal" element={<ReSendApplicantTokenForm />} />
      <Route
        path="/applicant-portal/:applicantToken"
        element={<ApplicantPortal />}
      /> */}
    </>
  )
}

export default PublicRoutes
