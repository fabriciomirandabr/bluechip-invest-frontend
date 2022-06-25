import { makeVar } from '@apollo/client'
import Web3 from 'web3'

export interface Account {
  address: string
  chainId: number
  chainName: string
  web3: Web3
}

export const accountVar = makeVar<Account | undefined>(undefined)
