import Web3 from 'web3'
import { configByChain } from '../config'

export const web3Service = (chainId: number) => {
  const { infura } = configByChain(chainId)
  const web3 = new Web3(new Web3.providers.HttpProvider(`${infura.api}/${infura.key}`))
  return {
    web3
  }
}
