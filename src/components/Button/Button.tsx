import styled from 'styled-components'

interface ButtonProps {
  width?: string
  height?: string
  type?: 'submit' | 'text' | 'reset'

  className?: string
  onClick: () => void
}

const StyledButton = styled.button<ButtonProps>``

export const PrimaryButton: React.FC<ButtonProps> = ({
  width = '100%',
  height = '35px',
  type,
  className,
  children,

  onClick,
}) => {
  return (
    <StyledButton
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      // type={type}
    >
      {children}
    </StyledButton>
  )
}
