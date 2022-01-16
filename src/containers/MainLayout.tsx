import { Layout } from 'antd'
import { Header } from 'modules/header'
import { ReworkedSidebar } from 'modules/sidebar'
import React, { useState } from 'react'
import { AuthRoutes } from './AuthRoutes'

const { Header: AntHeader, Content } = Layout

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleOpen = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Layout hasSider>
      <ReworkedSidebar open={sidebarOpen} />
      <Layout>
        <AntHeader>
          <Header toggleSidebar={() => toggleOpen()} />
        </AntHeader>
        <Content>
          <AuthRoutes />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
