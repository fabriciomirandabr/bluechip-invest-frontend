import { GetServerSideProps } from 'next'
import Image from 'next/image'
import styled from 'styled-components'
import Header from '../../../../components/layout/Header'
import { useAccount } from '../../../../hooks/useAccount'
import { useInvestment } from '../../../../hooks/useInvestment'

interface InvestmentDetailProps {
  chainId: number
  collection: string
}

export default function InvestmentDetail({ chainId, collection }: InvestmentDetailProps) {
  const { data, loading, error } = useInvestment(collection, chainId)
  const { account } = useAccount()

  return (
    <div>
      <Header />
      <main>
        <Container>
          <div>
            <h1>ACTIVE INVESTMENT ROUND</h1>
          </div>
          <div>
            <div>
              {loading && <div>loading</div>}
              {error && <div>error</div>}
              {!data && <div>empty</div>}
              {data && data.investment && (
                <>
                  <div>
                    <Image src={data.investment.image} width={100} height={100} unoptimized />
                  </div>
                  <div>
                    <span>Target ID: </span>
                    {data.investment.activeRound?.target.tokenId}
                  </div>
                  <div>
                    <span>Target Price: </span>
                    {data.investment.floorPrice}
                  </div>
                  <div>
                    <span>Progress: </span>
                    ???????
                  </div>
                  <div>
                    <span>Accumulated: </span>
                    ???????
                  </div>
                  <div>
                    <hr />
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
                </>
              )}
            </div>
            <div>ACTIONS</div>
          </div>
        </Container>
        <Container>
          <div>
            <h2>CLOSED INVESTMENT ROUND </h2>
          </div>
          <div>
            <div>
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
                </>
              )}
            </div>
            <div>ACTIONS</div>
          </div>
        </Container>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const chainId = context.params?.chainId
  const collection = context.params?.collection

  return {
    props: {
      chainId: Number(chainId),
      collection
    }
  }
}

export const { Container } = {
  Container: styled.div``
}
