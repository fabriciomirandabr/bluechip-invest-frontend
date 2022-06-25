import { useQuery } from '@apollo/client'
import { InvestmentData, InvestmentVars, INVESTMENT_QUERY } from '../graphql/query/Investment'

export const useInvestment = (collectionAddress: string, chainId: number) => {
  const { loading, data, error, refetch } = useQuery<InvestmentData, InvestmentVars>(INVESTMENT_QUERY, {
    variables: {
      collectionAddress,
      chainId
    }
  })

  return {
    loading,
    data,
    error,
    refetch
  }
}
