import styled, { css } from 'styled-components'

interface ButtonProps {
  width?: string
  height?: string
  borderRadius?: string
  backgroundColor?: string
  type?: 'submit' | 'text' | 'reset'
  buttonStyle?: 'primary' | 'cancel'
  hide?: boolean

  className?: string
  onClick?: () => void
}

const getButtonStyle = (buttonType: 'primary' | 'cancel' | undefined) => {
  if (buttonType === undefined) return css``
  switch (buttonType) {
    case 'primary':
      return css`
        background-color: ${props => props.theme.colors.purpleAction};
        color: ${props => props.theme.colors.white};
      `
    case 'cancel':
      return css`
        background-color: ${props => props.theme.colors.gray2};
        color: ${props => props.theme.colors.white};
      `
  }
}

const StyledButton = styled.button<ButtonProps>`
  display: ${props => (props.hide ? 'none' : 'inline-block')};
  width: ${props => props.width};
  height: ${props => props.height};
  font-weight: 500;
  font-size: 16px;
  border-radius: ${props => props.borderRadius};
  border: none;
  box-shadow: ${props => props.theme.shadow.default};
  ${props => getButtonStyle(props.buttonStyle)};

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

export const Button: React.FC<ButtonProps> = ({
  width = '100%',
  height = '35px',
  borderRadius = '4px',
  backgroundColor = 'purple',
  buttonStyle = 'primary',
  hide = false,
  type,
  className,
  children,

  onClick,
}) => {
  return (
    <StyledButton
      width={width}
      height={height}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      className={className}
      onClick={onClick}
      buttonStyle={buttonStyle}
      hide={hide}
      // type={type}
    >
      {children}
    </StyledButton>
  )
}
