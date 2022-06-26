import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import logo from '../../../public/assets/bluechip_invest.png'
import { colors } from '../../styles/theme'
import WalletButton from '../wallet/WalletButton'

interface HeaderProps {
  chainId: number
}

export default function Header({ chainId }: HeaderProps) {
  return (
    <Container>
      <div>
        <Link href={`/investment/${chainId}`}>
          <a>
            <Image src={logo} width={207} height={48} />
          </a>
        </Link>
      </div>
      <div>
        <WalletButton />
      </div>
    </Container>
  )
}

const { Container } = {
  Container: styled.header`
    display: grid;
    grid-template-columns: auto auto;
    gap: 16px;
    padding: 16px 24px;
    background: ${colors.white};
    box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.15);

    > div:nth-child(2) {
      display: grid;
      justify-content: flex-end;
      align-items: center;
    }

    @media (max-width: 768px) {
      gap: 8px;
      padding: 16px 8px;
    }
  `
}
