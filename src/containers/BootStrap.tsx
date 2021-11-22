import AuthProvider from 'context/Authentication'
import { useQuery } from '@apollo/client'
import { ME_QUERY } from 'modules/users/queries'
import { BrowserRouter as Router } from 'react-router-dom'
import MainLayout from 'containers/MainLayout'

import { PublicRoutes } from './PublicRoutes'

const Bootstrap: React.FC = () => {
  const { loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <span>Loading</span>

  if (error) return <span>Error {error.message}</span>

  const { me } = data

  if (me == null || me === undefined) {
    return <PublicRoutes />
  }
  return (
    <AuthProvider user={me}>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  )
}
export default Bootstrap
