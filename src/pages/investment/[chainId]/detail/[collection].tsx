import { GetServerSideProps } from 'next'
import styled from 'styled-components'
import InvestmentRound from '../../../../components/investment/InvestmentRound'
import Header from '../../../../components/layout/Header'
import { useAccount } from '../../../../hooks/useAccount'
import { useInvestment } from '../../../../hooks/useInvestment'
import { investmentService } from '../../../../services/InvestmentService'
import { colors } from '../../../../styles/theme'

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
            <Action>
              <button onClick={startInvestment}>Start Round</button>
            </Action>
          )}
          <div>
            <div>
              <Title>
                <h1>ACTIVE INVESTMENT ROUND</h1>
              </Title>

              {data && data.investment.activeRound && (
                <InvestmentRound investmentRound={data.investment} investment={data.investment.activeRound} chainId={chainId} />
              )}
            </div>
            <div>
              <Title>
                <h1>LAST INVESTMENTS ROUNDS</h1>
              </Title>
              {data &&
                data.investment.lastRounds.map(round => (
                  <InvestmentRound investmentRound={data.investment} investment={round} chainId={chainId} lastRound />
                ))}
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

export const { Container, Action, Title } = {
  Container: styled.div`
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 64px 32px;
  `,
  Action: styled.div`
    padding: 24px;
    background: ${colors.white};
    border-radius: 32px;
    box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.15);
  `,
  Title: styled.div`
    color: ${colors.white};
    text-align: center;

    h1 {
      font-size: 24px;
      line-height: 48px;
      margin-bottom: 24px;
    }
  `
}
