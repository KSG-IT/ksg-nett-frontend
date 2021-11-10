import styled from 'styled-components'

interface IconProps {
  className?: string
  icon: string
  color: string
  type?: 'light' | 'regular' | 'solid' | 'brand' | 'duotone'
  cursor?: string

  size?: string
  margin?: string

  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

interface IProps {
  color: string
  cursor: string
  size: string
  margin: string
}

const I = styled.i<IProps>`
  margin: ${props => props.margin};
  color: ${props => props.color}; //overload?
  font-size: ${props => props.size};
  cursor: ${props => props.cursor};
`

export const Icon: React.FC<IconProps> = ({
  className,
  icon,
  type = 'regular',

  color = 'inherit',
  cursor = 'inherit',

  size = '1em',
  margin = '0',

  onClick = () => void 0,
}) => {
  const iconClass = `fas fa-${icon}`

  return (
    <I
      className={iconClass}
      color={color}
      cursor={cursor}
      size={size}
      margin={margin}
      onClick={onClick}
    />
  )
}
