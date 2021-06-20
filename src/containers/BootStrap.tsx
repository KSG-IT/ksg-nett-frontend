import { useState } from 'react'
import { UserContext } from 'context/UserContext'
import { useQuery } from '@apollo/client'
import { ME_QUERY } from 'modules/users/queries'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom'
import MainLayout from 'containers/MainLayout'
import { fakeAuth, PrivateRoute } from './PrivateRoute/PrivateRoute'
import { Login } from 'modules/login'
import { PublicRoutes } from './PublicRoutes'
interface LocationState {
  from: {
    pathname: string
  }
}

const Public = () => <h3>This is public content</h3>
const Protected = () => <h3>This is hidden content</h3>

function LoginExample() {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false)
  const location = useLocation<LocationState>()
  const history = useHistory()

  const { from } = location.state || { from: { pathname: '/' } }

  const login = () =>
    fakeAuth.authenticate(() => {
      setRedirectToReferrer(true)
    })
  console.log(location)
  console.log(history)

  if (redirectToReferrer === true) {
    return <Redirect to={from || '/'} />
  }
  return (
    <div>
      <p>You must log in to view the page</p>
      <button onClick={login}>Log in</button>
    </div>
  )
}

const Bootstrap: React.FC = ({}) => {
  const { loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <span>Loading</span>

  if (error) return <span>Error {error.message}</span>

  const { me } = data

  if (me == null || me === undefined) {
    return <PublicRoutes />
  }
  return (
    <UserContext.Provider value={me}>
      <Router>
        <MainLayout />
      </Router>
    </UserContext.Provider>
  )
}

export default Bootstrap
