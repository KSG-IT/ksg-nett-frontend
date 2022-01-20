import { useQuery } from '@apollo/client'
import MainLayout from 'containers/MainLayout'
import AuthProvider from 'context/Authentication'
import { MeQueryReturns, ME_QUERY } from 'modules/users'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router } from 'react-router-dom'
import { PublicRoutes } from './PublicRoutes'

const Bootstrap: React.VFC = () => {
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
        <Toaster />
      </Router>
    </AuthProvider>
  )
}
export default Bootstrap
