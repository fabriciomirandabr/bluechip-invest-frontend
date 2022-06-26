import BigNumber from 'bignumber.js'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'
import Header from '../../../../components/layout/Header'
import { useAccount } from '../../../../hooks/useAccount'
import { useInvestment } from '../../../../hooks/useInvestment'
import { investmentService } from '../../../../services/InvestmentService'
import { units } from '../../../../utils'

interface InvestmentDetailProps {
  chainId: number
  collection: string
}

export default function InvestmentDetail({ chainId, collection }: InvestmentDetailProps) {
  const { data, loading, error } = useInvestment(collection, chainId)
  const { account } = useAccount()

  const [value, setValue] = useState('')

  const addMoney = async () => {
    if (account && data && data.investment.activeRound) {
      investmentService(chainId, account).addMoney(
        data.investment.activeRound.id,
        units(value, 18),
        units(data.investment.activeRound.amount, 18)
      )
    }
  }

  const removeAllMoney = async () => {
    if (account && data && data.investment.activeRound) {
      investmentService(chainId, account).removeAllMoney(data.investment.activeRound.id)
    }
  }

  return (
    <div>
      <Header chainId={chainId} />
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
                    <Image src={String(data.investment.activeRound?.image)} width={100} height={100} unoptimized />
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
                    {new BigNumber(data.investment.activeRound?.amount || 0).div(new BigNumber(data.investment.floorPrice)).toFixed(2)}%
                  </div>
                  <div>
                    <span>Accumulated: </span>
                    {data.investment.activeRound?.amount} ETH
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
            <div>
              {data && data.investment && (
                <>
                  <div>
                    {data.investment.activeRound?.buyers.map(buyerItem => (
                      <>
                        <span>
                          {buyerItem.buyer} | {buyerItem.amount} ETH
                        </span>
                        {buyerItem.buyer.toLocaleLowerCase() === account?.address.toLocaleLowerCase() && (
                          <button onClick={() => removeAllMoney()}>X</button>
                        )}
                      </>
                    ))}
                    {!data.investment.activeRound?.buyers.length && <div>No buyers</div>}
                  </div>
                  <div>
                    <input value={value} onChange={e => setValue(e.target.value)} disabled={!account?.address} />
                  </div>
                  <div>
                    {!account?.address && <button disabled>Connect Wallet</button>}
                    {account?.address && data.investment.activeRound?.status === 'CREATED' && <button onClick={addMoney}>Add Money</button>}
                  </div>
                </>
              )}
            </div>
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
