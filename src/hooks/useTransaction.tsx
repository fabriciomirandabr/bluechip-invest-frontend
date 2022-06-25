import { useReactiveVar } from '@apollo/client'
import { useEffect, useState } from 'react'
import { clearTransaction, TransactionType, transactionVar } from '../variables/TransactionVariable'

export function useTransaction(type: TransactionType, callback?: () => void) {
  const transaction = useReactiveVar(transactionVar)
  const [confirmed, setConfirmed] = useState(false)
  useEffect(() => {
    if (transaction && transaction.confirmed && !transaction.loading && transaction.type === type) {
      clearTransaction()
      setConfirmed(true)

      if (callback) {
        callback()
      }
    }
  }, [callback, transaction, type])

  return { loading: transaction, transaction, confirmed }
}
