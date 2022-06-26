import { gql } from '@apollo/client'

export interface InvestmentVars {
  collectionAddress: string
  chainId: number
}

export interface InvestmentData {
  investment: {
    activeRound?: {
      id: string
      status: 'CREATED'
      image?: string
      amount: string
      target: {
        collection: {
          name: string
        }
        tokenId: string
        tokenURI: string
      }
      acquiringData: string
      reservePrice: string
      buyersCount: string
      buyers: {
        amount: string
        buyer: string
        fractionsCount: string
        ownership: string
      }[]
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
        status
        amount
        image
        target {
          collection {
            name
          }
          tokenId
          tokenURI
        }
        acquiringData
        reservePrice
        buyersCount
        buyers {
          amount
          buyer
          fractionsCount
          ownership
        }
      }
      contractAddress
      description
      floorPrice
      floorSaleChangeToday
      image
      lastRounds {
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
      volumeToday
      whalesRankToday
    }
  }
`
