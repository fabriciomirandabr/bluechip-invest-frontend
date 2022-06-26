import { GetServerSideProps } from 'next'

interface InvestmentDetailProps {
  chainId: number
}

export default function InvestmentDetail() {
  return <div>[collectionAddress]</div>
}

export const getServerSideProps: GetServerSideProps = async context => {
  const chainId = context.params?.chainId

  return {
    props: {
      chainId: Number(chainId)
    }
  }
}
