import { useReactiveVar } from '@apollo/client'

import { useEffect } from 'react'
import { useAccount } from '../../hooks/useAccount'

import { transactionService } from '../../services/TransactionService'
import { transactionVar } from '../../variables/TransactionVariable'

export function WalletModal() {
  const transaction = useReactiveVar(transactionVar)
  const { account } = useAccount()

  useEffect(() => {
    if (transaction && account) {
      setTimeout(() => {
        const observeBlockchainInterval = setInterval(async () => {
          if (transaction && !transaction.confirmed && account.chainId) {
            const isConfirmedOnBlockchain = await transactionService().isConfirmedOnBlockchain(transaction.hash, account.chainId)
            if (isConfirmedOnBlockchain) {
              clearInterval(observeBlockchainInterval)
              transactionService().confirm(isConfirmedOnBlockchain.txBlockNumber)
            }
          }
        }, 2 * 1000)
      }, 11000)
    }
  }, [account, transaction])

  return <>{transaction && !transaction.confirmed && <p>Processing Transaction</p>}</>
}
