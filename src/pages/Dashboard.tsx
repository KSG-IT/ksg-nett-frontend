import MainLayout from 'components/Layout/MainLayout'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default Dashboard
