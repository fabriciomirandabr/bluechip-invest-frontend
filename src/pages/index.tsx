import WalletButton from '../components/wallet/WalletButton'
import { WalletModal } from '../components/wallet/WalletModal'
import { useAccount } from '../hooks/useAccount'

export default function Home() {
  const { account } = useAccount()

  return (
    <div>
      <WalletModal />
      {!account && <WalletButton />}
      <p>Dev Crypto 🇧🇷</p>
    </div>
  )
}
