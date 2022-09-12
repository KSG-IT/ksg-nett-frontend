import Dashboard from 'pages/Dashboard'
import { Route, Routes } from 'react-router-dom'
import { useStore } from 'store'
import PublicRoutes from './public-routes'

export const AppRoutes = () => {
  const token = useStore(selector => selector.token)

  console.log(token)
  if (!token) {
    return <PublicRoutes />
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<p>Hello World</p>} />
        <Route path="/dashboard/events" element={<p>Hello Events</p>} />
      </Route>
    </Routes>
  )
}
