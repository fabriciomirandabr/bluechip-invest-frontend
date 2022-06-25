import { useReactiveVar } from '@apollo/client'
import { Account, accountVar } from '../services/AccountVariable'

export function useAccount() {
  const account = useReactiveVar(accountVar)

  return {
    account,
    setAccount: (accountInput?: Account) => accountVar(accountInput)
  }
}
