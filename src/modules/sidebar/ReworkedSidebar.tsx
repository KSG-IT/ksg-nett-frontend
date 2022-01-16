import { UserOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Layout, Menu, Row, Typography } from 'antd'
import { useAuth } from 'context/Authentication'
import { useHistory } from 'react-router-dom'
import { removeLoginToken } from 'util/auth'

const { Sider } = Layout
const { Title } = Typography

interface ReworkedSidebarProps {
  open: boolean
}

export const ReworkedSidebar: React.VFC<ReworkedSidebarProps> = ({ open }) => {
  const history = useHistory()
  const me = useAuth()

  const logout = () => {
    removeLoginToken()
    window.location.reload()
  }
  return (
    <Sider
      width={250}
      breakpoint="sm"
      collapsible
      collapsed={open}
      collapsedWidth={0}
      style={{
        overflow: 'auto',
        height: '100vh',
      }}
      onBreakpoint={broken => {
        console.log(broken)
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type)
      }}
    >
      <Menu mode="inline" title="KSG-nett">
        <Row justify="center" align="middle">
          <Col span={18}>
            <Title>KSG-nett</Title>
          </Col>
        </Row>
        <Menu.ItemGroup key={'1'}>
          <Menu.Item
            key="1-1"
            icon={<UserOutlined />}
            onClick={() => {
              history.push(`/users/${me.id}`)
            }}
          >
            Min profil
          </Menu.Item>
          <Menu.Item
            key="1-2"
            icon={<FontAwesomeIcon icon="university" />}
            onClick={() => history.push(`/economy/me`)}
          >
            Min økonomi
          </Menu.Item>
          <Menu.Item key="1-3" icon={<FontAwesomeIcon icon="calendar-alt" />}>
            Min vaktplan
          </Menu.Item>
          <Menu.Item
            key="1-4"
            icon={<FontAwesomeIcon icon="sign-out-alt" />}
            onClick={logout}
          >
            Logg ut
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="Generelt" key="2">
          <Menu.Item
            key="2-1"
            icon={<FontAwesomeIcon icon="home" />}
            onClick={() => history.push('/dashboard')}
          >
            Kontrollpanel
          </Menu.Item>
          <Menu.Item key="2-2" icon={<FontAwesomeIcon icon="diagnoses" />}>
            Arrangementer
          </Menu.Item>
          <Menu.Item key="2-3" icon={<FontAwesomeIcon icon="edit" />}>
            Møtereferater
          </Menu.Item>
          <Menu.Item
            key="2-4"
            icon={<FontAwesomeIcon icon="project-diagram" />}
          >
            Gjengene
          </Menu.Item>
        </Menu.ItemGroup>

        <Menu.SubMenu title="Underholdning" key="3">
          <Menu.Item key="3-1" onClick={() => history.push('/quotes')}>
            Sitater
          </Menu.Item>
          <Menu.Item key="3-2" onClick={() => history.push('/quiz')}>
            Quiz
          </Menu.Item>
          <Menu.Item key="3-3" onClick={() => history.push('/gallery')}>
            Galleri
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu title="Admin" key={'4'}>
          <Menu.Item key="4-1" onClick={() => history.push('/schedules')}>
            Vaktlister
          </Menu.Item>
          <Menu.Item key="4-2" onClick={() => history.push('/human-resources')}>
            Personal
          </Menu.Item>
          <Menu.Item key="4-3" onClick={() => history.push('/admissions')}>
            Opptak
          </Menu.Item>
          <Menu.Item
            key="4-4"
            onClick={() => history.push('/economy/deposits')}
          >
            Innskudd
          </Menu.Item>
          <Menu.Item
            key="4-5"
            onClick={() => history.push('/economy/soci-shop')}
          >
            Socishop
          </Menu.Item>
          <Menu.Item
            key="4-6"
            onClick={() => history.push('/economy/soci-sessions')}
          >
            Krysselister
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  )
}
