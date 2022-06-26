import BigNumber from 'bignumber.js'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { InvestmentRoundFull } from '../../graphql/query/Investment'
import { useAccount } from '../../hooks/useAccount'
import { useInvestment } from '../../hooks/useInvestment'
import { investmentService } from '../../services/InvestmentService'
import { colors } from '../../styles/theme'
import Button from '../shared/Button'

interface InvestmentCardProps {
  collection: string
  chainId: number
  detail?: boolean
  investment?: InvestmentRoundFull
  floorPrice?: number
}

export default function InvestmentCard({ collection, chainId, detail, investment, floorPrice }: InvestmentCardProps) {
  const { data, loading, error } = useInvestment(collection, chainId)
  const { account } = useAccount()

  const startInvestment = () => {
    if (account && data) {
      investmentService(chainId, account).createInvestment(
        collection,
        `${data.investment.name} Fractions`,
        `${data.investment.name.substring(0, 3)}`
      )
    }
  }

  return (
    <Container>
      {data && data.investment && (
        <Card>
          <div>
            <Image src={investment?.image || data.investment.image} width={300} height={300} unoptimized />
          </div>

          <div>{data.investment.name}</div>
          {detail && (
            <>
              <div>
                <div>Target ID:</div>
                <div>{investment?.target.tokenId}</div>
              </div>
              <div>
                <div>Target Price:</div>
                <div> {Number(Number(floorPrice) * 1.1).toFixed(5)}</div>
              </div>
              <div>
                <div>Progress:</div>
                <div>{new BigNumber(investment?.amount || 0).div(new BigNumber(Number(floorPrice))).toFixed(2)}%</div>
              </div>
              <div>
                <div>Accumulated:</div>
                <div>{investment?.amount} ETH</div>
              </div>
            </>
          )}
          <div>
            <div>Whale Rank:</div>
            <div>{data.investment.whalesRankToday}</div>
          </div>
          <div>
            <div>Volume Today: </div>
            <div>{Number(data.investment.volumeToday).toFixed(2)} ETH</div>
          </div>
          <div>
            <div>Floor Price: </div>
            <div>{data.investment.floorPrice} ETH</div>
          </div>
          <div>
            <div>Change Today: </div>
            <div>{data.investment.floorSaleChangeToday.toFixed(2)}%</div>
          </div>
          {!detail && (
            <div>
              <div>Active Investors:</div>
              <div>{data.investment.activeRound?.buyersCount || '0'}</div>
            </div>
          )}

          {!data.investment.activeRound?.buyersCount && (
            <div>
              {account && chainId === account.chainId && <Button onClick={startInvestment}>Start Round</Button>}
              {account && chainId !== account.chainId && <Button disabled>Change Network</Button>}
            </div>
          )}
          {!account && !detail && (
            <div>
              <Button disabled>Connect Wallet</Button>
            </div>
          )}
          {!detail && (
            <div>
              {account && (
                <Link href={`${chainId}/detail/${collection}`}>
                  <a>
                    <Button>Enter Investment</Button>
                  </a>
                </Link>
              )}
            </div>
          )}
        </Card>
      )}
    </Container>
  )
}

const { Container, Card } = {
  Container: styled.div`
    display: grid;
    max-width: 300px;
  `,
  Card: styled.div`
    padding: 24px;
    background: ${colors.white};
    border-radius: 32px;
    box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.15);

    a {
      width: 100%;
      button {
        width: 100%;
      }
    }

    img {
      border-radius: 16px;
    }

    > div {
      margin-bottom: 4px;
      display: grid;

      > div:nth-child(1) {
        color: ${colors.gray[500]};
      }
    }

    > div:nth-child(1) {
      grid-template-columns: 1fr;
      margin-bottom: 16px;
    }

    > div:nth-child(2) {
      color: ${colors.blue[500]};
      font-size: 18px;
      font-weight: 500;
      grid-template-columns: 1fr;
      margin-bottom: 12px;
    }

    > div:nth-child(3),
    > div:nth-child(4),
    > div:nth-child(5),
    > div:nth-child(6),
    > div:nth-child(7) {
      grid-template-columns: 1fr 1fr;
    }

    > div:nth-child(7) {
      margin-bottom: 16px;
    }
  `
}
