import { gql } from '@apollo/client'

export interface FinishRoundVars {
  chainId: number
  listingId: string
}

export interface FinishRoundData {
  finishRound: boolean
}

export const FINISH_ROUND_MUTATION = gql`
  mutation ($chainId: Int!, $listingId: String!) {
    finishRound(chainId: $chainId, listingId: $listingId)
  }
`
