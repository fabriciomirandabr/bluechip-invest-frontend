import WalletButton from '../components/wallet/WalletButton'
import { WalletModal } from '../components/wallet/WalletModal'
import { useAccount } from '../hooks/useAccount'
import { investmentService } from '../services/InvestmentService'

export default function Home() {
  const { account } = useAccount()

  return (
    <div>
      <WalletModal />
      {!account && <WalletButton />}
      <p>Dev Crypto 🇧🇷</p>
      {account && (
        <button onClick={() => investmentService().create('0x46bEF163D6C470a4774f9585F3500Ae3b642e751', 'Blocks', 'BLC', 4, account)}>
          Test Create Investment
        </button>
      )}
    </div>
  )
}
