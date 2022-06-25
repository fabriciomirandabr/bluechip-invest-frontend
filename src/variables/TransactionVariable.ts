import { makeVar } from '@apollo/client'

export enum TransactionType {
  test = 'test'
}

export type Transaction = {
  hash: string
  type: TransactionType
  confirmed: boolean
  loading: boolean
}

export const transactionVar = makeVar<Transaction | undefined>(undefined)

export const setTransaction = (hash: string, type: TransactionType) => {
  const transaction: Transaction = { hash, type, confirmed: false, loading: true }
  transactionVar(transaction)
}

export const clearTransaction = () => {
  transactionVar(undefined)
}
