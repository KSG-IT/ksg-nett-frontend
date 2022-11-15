import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { InternalGroupNode } from '../types'

const Wrapper = styled.div`
  display: flex;
  background: white;
  color: black;
  height: 120px;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  padding: 1.618em;
  box-shadow: ${props => props.theme.shadow.default};

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.lightGray};
    transform: scale(0.98);
  }
`
interface GroupIconProps {
  src: string
}

const GroupName = styled.h2``

const GroupIcon = styled.div<GroupIconProps>`
  width: 60px;
  height: 80px;
  background-image: url('${props => props.src}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border-radius: 4px;
`

interface InternalGroupCardProps {
  internalGroup: InternalGroupNode
}

export const InternalGroupCard: React.VFC<InternalGroupCardProps> = ({
  internalGroup,
}) => {
  const navigate = useNavigate()
  return (
    <Wrapper
      onClick={() => {
        navigate(`/internal-groups/${internalGroup.id}`)
      }}
    >
      <GroupName>{internalGroup.name}</GroupName>
      <GroupIcon
        src={
          internalGroup.groupIcon ??
          'https://static.wikia.nocookie.net/roblox/images/3/3b/NOOB!.png'
        }
      />
    </Wrapper>
  )
}
