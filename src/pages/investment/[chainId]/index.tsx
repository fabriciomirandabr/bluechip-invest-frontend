import { GetServerSideProps } from 'next'
import styled from 'styled-components'
import InvestmentCard from '../../../components/investment/InvestmentCard'
import Header from '../../../components/layout/Header'
import useCollections from '../../../hooks/useCollections'

interface InvestmentsProps {
  chainId: number
}

export default function Investments({ chainId }: InvestmentsProps) {
  const collections = useCollections(chainId)

  return (
    <div>
      <Header chainId={chainId} />
      <Container>
        {collections.map(collection => (
          <InvestmentCard collection={collection} chainId={chainId} />
        ))}
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const chainId = context.params?.chainId

  return {
    props: {
      chainId: Number(chainId)
    }
  }
}

const { Container } = {
  Container: styled.main`
    display: grid;
    align-items: center;
    justify-content: center;
    grid-auto-columns: auto;
    gap: 64px;
    margin: 128px 32px;
  `
}
