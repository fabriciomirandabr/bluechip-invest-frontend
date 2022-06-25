import { gql } from '@apollo/client'

export interface InvestmentVars {
  collectionAddress: string
  chainId: number
}

export interface InvestmentData {
  investment: {
    activeRound: {
      id: string
      target: {
        collection: {
          name: string
        }
        tokenId: string
        tokenURI: string
      }
    }
    contractAddress: string
    description: string
    floorPrice: number
    floorSaleChangeToday: number
    image: string
    lastRound: {
      id: string
      target: {
        collection: {
          name: string
        }
        tokenId: string
        tokenURI: string
      }
    }
    name: string
    slug: string
    volumeToday: number
    whalesRankToday: number
  }
}

export const INVESTMENT_QUERY = gql`
  query investment($collectionAddress: String!, $chainId: Float!) {
    investment(collectionAddress: $collectionAddress, chainId: $chainId) {
      activeRound {
        id
        target {
          collection {
            name
          }
          tokenId
          tokenURI
        }
      }
      contractAddress
      description
      floorPrice
      floorSaleChangeToday
      image
      lastRound {
        id
        target {
          collection {
            name
          }
          tokenId
          tokenURI
        }
      }
      name
    }
  }
`
