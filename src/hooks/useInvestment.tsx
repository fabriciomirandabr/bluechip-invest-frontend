import { useQuery, useReactiveVar } from '@apollo/client'
import { useEffect } from 'react'
import { InvestmentData, InvestmentVars, INVESTMENT_QUERY } from '../graphql/query/Investment'
import { loadingVar } from '../variables/TransactionVariable'

export const useInvestment = (collectionAddress: string, chainId: number) => {
  const loadingTX = useReactiveVar(loadingVar)

  const { loading, data, error, refetch } = useQuery<InvestmentData, InvestmentVars>(INVESTMENT_QUERY, {
    variables: {
      collectionAddress,
      chainId: chainId
    }
  })

  useEffect(() => {
    refetch()
  }, [loadingTX])

  return {
    loading,
    data,
    error,
    refetch
  }
}
