import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { useState } from 'react'
import {
  InvestmentRoundCollection as InvestmentRoundItem,
  InvestmentRoundItem as InvestmentRoundFull
} from '../../graphql/query/Investment'
import { useAccount } from '../../hooks/useAccount'
import { investmentService } from '../../services/InvestmentService'
import { units } from '../../utils'

export interface InvestmentRoundProps {
  investment: InvestmentRoundFull
  investmentRound: InvestmentRoundItem
  chainId: number
  lastRound?: boolean
}

export default function InvestmentRound({ investment, investmentRound, chainId, lastRound }: InvestmentRoundProps) {
  const { account } = useAccount()

  const [value, setValue] = useState('')

  const addMoney = async () => {
    if (account && investmentRound.activeRound) {
      investmentService(chainId, account).addMoney(
        investmentRound.activeRound.id,
        units(value, 18),
        units(investmentRound.activeRound.amount, 18)
      )
    }
  }

  const removeAllMoney = async () => {
    if (account && investmentRound.activeRound) {
      investmentService(chainId, account).removeAllMoney(investmentRound.activeRound.id)
    }
  }

  const closeInvestment = async () => {
    if (account && investmentRound.activeRound) {
      investmentService(chainId, account).closeInvestment(investmentRound.activeRound.id, investmentRound.activeRound.acquiringData)
    }
  }

  const claimFractions = async () => {
    if (
      account &&
      investment.buyers.filter(buyer => buyer.buyer.toLowerCase() === account.address.toLowerCase() && buyer.fractionsCount !== '0').length
    ) {
      investmentService(chainId, account).claimFractions(investment.id)
    }
  }

  return (
    <div>
      <div>
        {investment && (
          <>
            <div>
              <Image src={String(investment.image)} width={100} height={100} unoptimized />
            </div>
            <div>
              <span>Target ID: </span>
              {investment.target.tokenId}
            </div>
            <div>
              <span>Target Price: </span>
              {Number(investmentRound.floorPrice) * 1.1}
            </div>
            <div>
              <span>Progress: </span>
              {new BigNumber(investment.amount || 0).div(new BigNumber(investmentRound.floorPrice)).toFixed(2)}%
            </div>
            <div>
              <span>Accumulated: </span>
              {investment.amount} ETH
            </div>
            <div>
              <hr />
            </div>
            <div>
              <span>Collection: </span>
              {investmentRound.name}
            </div>
            <div>
              <span>Whale Rank: </span>
              {investmentRound.whalesRankToday}
            </div>
            <div>
              <span>Volume Today: </span>
              {investmentRound.volumeToday} ETH
            </div>
            <div>
              <span>Floor Price: </span>
              {investmentRound.floorPrice} ETH
            </div>
            <div>
              <span>Change Today: </span>
              {investmentRound.floorSaleChangeToday}%
            </div>
            <div>
              <span>Active Investors: </span>
              {investment.buyersCount}
            </div>
          </>
        )}
      </div>
      <div>
        {investment && (
          <>
            {lastRound && (
              <div>
                <button>FLIP ON OPEN SEA BY 20% MORE</button>
                <button>SELL PARTIAL FRACTIONS ON UNISWAP</button>
              </div>
            )}
            <div>
              {investment.buyers.map(buyerItem => (
                <>
                  <span>
                    {buyerItem.buyer} | {buyerItem.amount} ETH
                  </span>
                  {buyerItem.buyer.toLocaleLowerCase() === account?.address.toLocaleLowerCase() && (
                    <button onClick={() => removeAllMoney()}>X</button>
                  )}
                </>
              ))}
              {!investment.buyers.length && <div>No buyers</div>}
            </div>
            <div>
              <input
                value={value}
                onChange={e => setValue(e.target.value)}
                disabled={
                  !investmentRound.activeRound ||
                  !account?.address ||
                  (investment.status === 'CREATED' && Number(investment.amount) >= Number(investmentRound.floorPrice) * 1.1)
                }
              />
            </div>
            <div>
              {!account?.address && <button disabled>Connect Wallet</button>}
              {account?.address &&
                !lastRound &&
                investment.status === 'CREATED' &&
                Number(investment.amount) < Number(investmentRound.floorPrice) * 1.1 && <button onClick={addMoney}>Add Money</button>}
              {account?.address &&
                investment.status === 'CREATED' &&
                Number(investment.amount) >= Number(investmentRound.floorPrice) * 1.1 && (
                  <button onClick={closeInvestment}>Close Round</button>
                )}

              {!!(
                account &&
                investment.buyers.filter(
                  buyer => buyer.buyer.toLowerCase() === account.address.toLowerCase() && buyer.fractionsCount !== '0'
                ).length
              ) && <button onClick={claimFractions}>Claim Fractions</button>}
              {!(
                account &&
                investment.buyers.filter(
                  buyer => buyer.buyer.toLowerCase() === account.address.toLowerCase() && buyer.fractionsCount !== '0'
                ).length
              ) && <button>Fractions Claimed</button>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
