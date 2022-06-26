import { GetServerSideProps } from 'next'
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
      <main>
        {collections.map(collection => (
          <InvestmentCard collection={collection} chainId={chainId} />
        ))}
      </main>
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
