import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { useAccount } from '../../hooks/useAccount'
import { useInvestment } from '../../hooks/useInvestment'
import { investmentService } from '../../services/InvestmentService'
import { colors } from '../../styles/theme'

interface InvestmentCardProps {
  collection: string
  chainId: number
}

export default function InvestmentCard({ collection, chainId }: InvestmentCardProps) {
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
      {loading && <div>loading</div>}
      {error && <div>error</div>}
      {!data && <div>empty</div>}
      {data && data.investment && (
        <>
          <div>
            <Image src={data.investment.image} width={100} height={100} unoptimized />
          </div>
          <div>
            <span>Collection: </span>
            {data.investment.name}
          </div>
          <div>
            <span>Whale Rank: </span>
            {data.investment.whalesRankToday}
          </div>
          <div>
            <span>Volume Today: </span>
            {data.investment.volumeToday} ETH
          </div>
          <div>
            <span>Floor Price: </span>
            {data.investment.floorPrice} ETH
          </div>
          <div>
            <span>Change Today: </span>
            {data.investment.floorSaleChangeToday}%
          </div>
          <div>
            <span>Active Investors: </span>
            {data.investment.activeRound?.buyersCount}
          </div>
          {!data.investment.activeRound?.buyersCount && (
            <div>
              {account && chainId === account.chainId && <button onClick={startInvestment}>Start Round</button>}
              {account && chainId !== account.chainId && <button disabled>Change Network</button>}
            </div>
          )}
          {!account && (
            <div>
              <button disabled>Connect Wallet</button>
            </div>
          )}
          {Number(data.investment.activeRound?.buyersCount) === 0 && (
            <div>
              {account && (
                <Link href={`${chainId}/detail/${collection}`}>
                  <a>Enter Investment</a>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </Container>
  )
}

const { Container } = {
  Container: styled.div`
    background: ${colors.gray[100]};
  `
}
