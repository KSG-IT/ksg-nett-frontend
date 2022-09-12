import { Login } from 'modules/login'
import { Route, Routes } from 'react-router-dom'

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login2" element={<Login />} />
    </Routes>
  )
}

export default PublicRoutes
