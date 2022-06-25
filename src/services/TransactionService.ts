import { Transaction, transactionVar } from '../variables/TransactionVariable'
import { web3Service } from './Web3Service'

export interface TransactionService {
  confirm(txBlockNumber: number): Promise<void>
  isConfirmedOnBlockchain(txHash: string, chainId: number): Promise<{ isConfirmedOnWeb3: boolean; txBlockNumber: number } | null>
}

export function transactionService(): TransactionService {
  return {
    confirm: async () => {
      const transaction = transactionVar()
      if (transaction) {
        const { hash, type } = transaction
        const transactionItem: Transaction = {
          hash,
          type,
          confirmed: true,
          loading: false
        }
        transactionVar(transactionItem)
      }
    },
    async isConfirmedOnBlockchain(txHash: string, chainId: number) {
      try {
        const web3 = web3Service(chainId).web3
        const tx = await web3.eth.getTransaction(txHash)

        if (tx.blockNumber === null) {
          return null
        }

        const currentBlock = await web3.eth.getBlockNumber()
        const web3ConfirmationsCount = 2
        const isConfirmedOnWeb3 = currentBlock - tx.blockNumber > web3ConfirmationsCount
        return { isConfirmedOnWeb3, txBlockNumber: tx.blockNumber }
      } catch (error) {
        return null
      }
    }
  }
}
