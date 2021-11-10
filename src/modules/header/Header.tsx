import styled from 'styled-components'
import { Icon } from 'components/Icon'
import { useAuth } from 'context/Authentication'
import { ZIndexRange } from 'types/enums'
import { UserThumbnail } from 'modules/users'
import { Link } from 'react-router-dom'

const Wrapper = styled.header`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 0 12px;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.gray2};
  z-index: ${ZIndexRange.Header};
`

const ToggleSidebarButton = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  width: 42px;
  aspect-ratio: 1/1;
  background-color: ${props => props.theme.colors.primary};

  ${props => props.theme.media.mobile} {
    display: flex;
  }
`

const LogoTitle = styled(Link)`
  font-size: 32px;
  font-weight: 600;
  color: black;
  text-decoration: none;
`

interface HeaderProps {
  toggleSidebar: () => void
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
  const user = useAuth()
  return (
    <Wrapper>
      <LogoTitle to="/dashboard">KSG</LogoTitle>
      <UserThumbnail size="medium" user={user} />
      <ToggleSidebarButton onClick={toggleSidebar}>
        <Icon icon="bars" size="32px" color="black" />
      </ToggleSidebarButton>
    </Wrapper>
  )
}
