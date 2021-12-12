import MainLayout from 'containers/MainLayout'
import AuthProvider from 'context/Authentication'
import { BrowserRouter as Router } from 'react-router-dom'
import { ME_QUERY } from 'modules/users'
import { PublicRoutes } from './PublicRoutes'
import { useQuery } from '@apollo/client'
import { MeQueryReturns } from 'modules/users'

const Bootstrap: React.FC = () => {
  const { loading, error, data } = useQuery<MeQueryReturns>(ME_QUERY)

  if (loading || data === undefined) return <span>Loading</span>

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
