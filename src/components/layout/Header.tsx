import Image from 'next/image'
import styled from 'styled-components'
import logo from '../../../public/assets/bluechip_invest.png'
import WalletButton from '../wallet/WalletButton'

export default function Header() {
  return (
    <Container>
      <div>
        <Image src={logo} width={207} height={48} />
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

    > div:nth-child(2) {
      display: grid;
      justify-content: flex-end;
      align-items: center;
    }
  `
}
