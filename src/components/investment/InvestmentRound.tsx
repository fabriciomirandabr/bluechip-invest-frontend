import { useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled from 'styled-components'
import { InvestmentRoundFull, InvestmentRoundItem } from '../../graphql/query/Investment'
import { useAccount } from '../../hooks/useAccount'
import { investmentService } from '../../services/InvestmentService'
import { colors } from '../../styles/theme'
import { shortAddress, units } from '../../utils'
import Button from '../shared/Button'
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
      {investment && <InvestmentCard collection={investmentRound.contractAddress} chainId={chainId} detail />}

      {investment && (
        <Card>
          {investment.buyers.map(buyerItem => (
            <Buyers>
              <div>
                <div>
                  <Jazzicon diameter={24} seed={jsNumberForAddress(buyerItem.buyer || '0')} />
                </div>
                <div>{shortAddress(buyerItem.buyer, 6, -6)}</div>
                <div>{buyerItem.amount} ETH</div>
              </div>
              {buyerItem.buyer.toLocaleLowerCase() === account?.address.toLocaleLowerCase() && !lastRound && (
                <Button onClick={() => removeAllMoney()}>Remove Money</Button>
              )}
            </Buyers>
          ))}
          {!investment.buyers.length && <div>Be Investor, start with any value</div>}

          {investment.status === 'CREATED' && (
            <div>
              <Input
                value={value}
                onChange={e => setValue(e.target.value)}
                disabled={
                  !investmentRound.activeRound ||
                  !account?.address ||
                  (investment.status === 'CREATED' && Number(investment.amount) >= Number(investmentRound.floorPrice) * 1.1)
                }
              />
            </div>
          )}

          <div>
            {!account?.address && <Button disabled>Connect Wallet</Button>}
            {account?.address &&
              !lastRound &&
              investment.status === 'CREATED' &&
              Number(investment.amount) < Number(investmentRound.floorPrice) * 1.1 && <Button onClick={addMoney}>Add Money</Button>}
            {account?.address &&
              investment.status === 'CREATED' &&
              Number(investment.amount) >= Number(investmentRound.floorPrice) * 1.1 && (
                <Button onClick={closeInvestment}>Close Round</Button>
              )}

            {!!(
              account?.address &&
              investment.buyers.filter(buyer => buyer.buyer.toLowerCase() === account.address.toLowerCase() && buyer.fractionsCount !== '0')
                .length
            ) &&
              lastRound && <Button onClick={claimFractions}>Claim Fractions</Button>}
            {lastRound &&
              !(
                account?.address &&
                investment.buyers.filter(
                  buyer => buyer.buyer.toLowerCase() === account.address.toLowerCase() && buyer.fractionsCount !== '0'
                ).length
              ) && <Button disabled>Fractions Claimed</Button>}
          </div>
          {lastRound && (
            <div>
              <Button margin>Flip NFT on Open Sea</Button>
              <Button margin>Sell Fractions on Uniswap</Button>
            </div>
          )}
        </Card>
      )}
    </Container>
  )
}

const { Container, Card, Input, Buyers } = {
  Container: styled.div`
    display: grid;
    grid-template-columns: 300px 300px;
    gap: 32px;
    margin-bottom: 48px;
    align-items: flex-start;
    justify-content: center;
  `,
  Card: styled.div`
    padding: 24px;
    background: ${colors.white};
    border-radius: 32px;
    box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.15);

    > div:not(:last-of-type) {
      margin-bottom: 16px;
      display: grid;
    }
  `,
  Input: styled.input`
    background: ${colors.grayLight[300]};
    padding: 8px 8px;
    border: 0;
    border-radius: 8px;
    font-size: 16px;
    line-height: 20px;
    box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.15);
    color: ${colors.blue[900]};

    &:focus {
      outline: none;
      border: 0;
    }
  `,
  Buyers: styled.div`
    > div:nth-child(1) {
      margin-bottom: 16px;
      display: grid;
      grid-template-columns: 24px auto auto;
      gap: 8px;
      align-items: center;

      > div:last-child {
        text-align: end;
      }
    }
  `
}
