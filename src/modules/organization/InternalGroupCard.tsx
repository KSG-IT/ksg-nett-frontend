import styled from 'styled-components'
import { InternalGroupNode } from './types'

const Wrapper = styled.div`
  display: flex;
  background: #e3e3e3;
  color: black;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  padding: 10px;
  padding-right: 5%;
  box-shadow: ${props => props.theme.shadow.default};

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.lightGray};
    transform: scale(0.98);
  }
`
interface GroupImageProps {
  src: string
}

const GroupIcon = styled.div<GroupImageProps>`
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
  console.log(internalGroup.groupImage)

  return (
    <Wrapper>
      <h2>{internalGroup.name}</h2>
      <GroupIcon
        src={
          internalGroup.groupImage ??
          'https://static.wikia.nocookie.net/roblox/images/3/3b/NOOB!.png'
        }
      />
    </Wrapper>
  )
}
