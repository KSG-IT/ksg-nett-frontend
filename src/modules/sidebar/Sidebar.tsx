import styled from 'styled-components'
import { useRenderMobile } from 'util/isMobile'
import { ZIndexRange } from 'types/enums'
import kitLogo from 'assets/images/kit_logo.png'
import { SidebarNav } from './SidebarNav'
import { UserThumbnail } from 'modules/users'
import { useAuth } from 'context/Authentication'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getLiquidity } from 'modules/economy/utils'
import { Liquidity } from 'modules/economy/types'
import { NavItem } from './NavItem'
import { removeLoginToken } from 'util/auth'
import { useHistory } from 'react-router'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 10px;
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.purple};
  z-index: ${ZIndexRange.Sidebar};
  overflow-y: scroll;
`

const SidebarTop = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.colors.purple};
  width: 100%;
  height: 80px;
  align-items: center;

  ${props => props.theme.media.mobile} {
    display: none;
  }
`

const SidebarUserprofile = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding: 20px 20px 0 20px;
  ${props => props.theme.media.mobile} {
    padding: 0 20px;
  }
`

const UserInfoWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 60px;
  grid-template-areas:
    'thumbnail name'
    'thumbnail balance';
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr 1fr;
`

const ThumbnailWrapper = styled.div`
  grid-area: thumbnail;
  display: flex;
  align-items: center;
`

const UserFullname = styled.div`
  grid-area: name;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
`
const UserBalanceWrapper = styled.div`
  grid-area: balance;
  display: flex;
  flex-direction: row;
  align-items: center;
`

interface UserBalanceProps {
  liquidity: Liquidity
}

const UserBalance = styled.div<UserBalanceProps>`
  font-size: 14px;
  font-weight: 600;

  color: ${props =>
    props.liquidity === 'negative'
      ? 'red'
      : props.liquidity === 'neutral'
      ? 'white'
      : props.liquidity === 'positive'
      ? 'yellow'
      : 'cyan'};
`

const SidebarLogo = styled.div`
  width: 75px;
  aspect-ratio: 1/1;
  background-image: url(${kitLogo});
  background-size: cover;
  background-position: 50% 50%;
`

const SidebarTopText = styled.h3`
  margin: 0 0 0 15px;
  display: flex;
  font-weight: 600;
`

const SidebarNavSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`

const Icon = styled(FontAwesomeIcon)`
  color: ${props => props.theme.colors.white};
  margin-right: 10px;
`

interface SidebarProps {
  sidebarOpen: boolean
  toggleSidebarCallback: () => void
}

export const Sidebar = ({ sidebarOpen }: SidebarProps) => {
  const isMobile = useRenderMobile()
  const history = useHistory()
  const user = useAuth()
  const shouldRenderSidebar = !isMobile || sidebarOpen

  const liquidity = getLiquidity(user.balance!)

  const logout = () => {
    removeLoginToken()
    history.push('/login')
  }

  return (
    <>
      {shouldRenderSidebar && (
        <Wrapper>
          <SidebarTop>
            <SidebarLogo />
            <SidebarTopText>Kafé- og Serveringsgjengen</SidebarTopText>
          </SidebarTop>
          <SidebarUserprofile>
            <UserInfoWrapper>
              <ThumbnailWrapper>
                <UserThumbnail user={user} size="medium" />
              </ThumbnailWrapper>
              <UserFullname>{user.fullName}</UserFullname>
              <UserBalanceWrapper>
                <Icon icon="coins" size="1x" />
                <UserBalance liquidity={liquidity}>
                  {user.balance},- NOK
                </UserBalance>
              </UserBalanceWrapper>
            </UserInfoWrapper>
            <NavItem
              icon="user"
              label="Min profil"
              link={`/users/${user.id}`}
            />
            <NavItem
              icon="money-bill-wave"
              label="Min økonomi"
              link={'/economy/me'}
            />
            <NavItem
              icon="calendar-alt"
              label="Min vaktplan"
              link={'/schedules/me'}
            />
            <NavItem icon="sign-out-alt" label="Logg ut" onClick={logout} />
          </SidebarUserprofile>
          <SidebarNavSection>
            <SidebarNav />
          </SidebarNavSection>
        </Wrapper>
      )}
    </>
  )
}
