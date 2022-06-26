import { useState } from 'react'
import styled from 'styled-components'
import {
  InvestmentRoundCollection as InvestmentRoundItem,
  InvestmentRoundItem as InvestmentRoundFull
} from '../../graphql/query/Investment'
import { useAccount } from '../../hooks/useAccount'
import { investmentService } from '../../services/InvestmentService'
import { units } from '../../utils'
import InvestmentCard from './InvestmentCard'

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
    <Container>
      <div>{investment && <InvestmentCard collection={investmentRound.contractAddress} chainId={chainId} detail />}</div>
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
    </Container>
  )
}

const { Container } = {
  Container: styled.div`
    display: grid;
    grid-template-columns: 300px 300px;
    gap: 32px;
    margin-bottom: 48px;
    align-items: flex-start;
    justify-content: center;
  `
}
