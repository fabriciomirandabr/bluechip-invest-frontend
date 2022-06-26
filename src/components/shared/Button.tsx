import styled from 'styled-components'
import { colors } from '../../styles/theme'

interface ButtonProps {
  onClick?: () => void
  children?: React.ReactNode
  disabled?: boolean
  margin?: boolean
}

export default function Button({ onClick, children, disabled, margin }: ButtonProps) {
  return (
    <Container onClick={onClick} disabled={disabled} className={`${disabled && 'disabled'} ${margin && 'margin'}`}>
      {children}
    </Container>
  )
}

const { Container } = {
  Container: styled.button`
    background-color: ${colors.blue[500]};
    color: ${colors.white};
    border-radius: 24px;
    padding: 10px 18px;
    border: none;
    font-weight: 500;
    font-size: 15px;
    transition: all 0.1s ease-out;
    display: flex;
    align-items: center;
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    width: 100%;

    &:hover {
      background-color: ${colors.blue[600]};
      transition: all 0.1s ease-in;
    }

    &.disabled {
      background-color: ${colors.grayLight[700]};
    }

    &.margin {
      margin-bottom: 16px;
    }
  `
}
