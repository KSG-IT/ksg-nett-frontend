import { PublicRoutes } from 'containers/PublicRoutes'
import { Routes } from 'react-router-dom'
import { useStore } from 'store'
import ProtectedRoutes from './protected-routes'

export const AppRoutes = () => {
  const user = useStore(selector => selector.user)

  if (!user) {
    return (
      <Routes>
        <PublicRoutes />
      </Routes>
    )
  }

  return (
    <Routes>
      <ProtectedRoutes />
    </Routes>
  )
}
