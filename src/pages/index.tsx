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
        <button
          onClick={() => investmentService(4, account).createInvestment('0x46bEF163D6C470a4774f9585F3500Ae3b642e751', 'Blocks', 'BLC')}
        >
          Test Create Investment
        </button>
      )}
      {account && (
        <button onClick={() => investmentService(4, account).addMoney('60', '0001000000000000000', '0003100000000000000')}>
          Test Add Money
        </button>
      )}
      {account && <button onClick={() => investmentService(4, account).removeAllMoney('60')}>Test Remove All Money</button>}
      {account && <button onClick={() => investmentService(4, account).closeInvestment('60', '0x')}>Test Close Round</button>}
      {account && <button onClick={() => investmentService(4, account).claimFractions('60')}>Test Claim Fractions</button>}
    </div>
  )
}
