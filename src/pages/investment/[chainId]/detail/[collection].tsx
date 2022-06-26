import { GetServerSideProps } from 'next'
import styled from 'styled-components'
import InvestmentRound from '../../../../components/investment/InvestmentRound'
import Header from '../../../../components/layout/Header'
import { useAccount } from '../../../../hooks/useAccount'
import { useInvestment } from '../../../../hooks/useInvestment'
import { investmentService } from '../../../../services/InvestmentService'

interface InvestmentDetailProps {
  chainId: number
  collection: string
}

export default function InvestmentDetail({ chainId, collection }: InvestmentDetailProps) {
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
    <div>
      <Header chainId={chainId} />
      <main>
        <Container>
          {data && !data.investment.activeRound && (
            <div>
              <button onClick={startInvestment}>Start Round</button>
            </div>
          )}
          <div>
            {loading && <div>loading</div>}
            {error && <div>error</div>}
            {!data && <div>empty</div>}
            <div>
              <h1>ACTIVE INVESTMENT ROUND</h1>
            </div>

            {data && data.investment.activeRound && (
              <InvestmentRound investmentRound={data.investment} investment={data.investment.activeRound} chainId={chainId} />
            )}
            <div>
              <h1>LAST INVESTMENT ROUND</h1>
            </div>
            {data &&
              data.investment.lastRounds.map(round => (
                <InvestmentRound investmentRound={data.investment} investment={round} chainId={chainId} lastRound />
              ))}
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
