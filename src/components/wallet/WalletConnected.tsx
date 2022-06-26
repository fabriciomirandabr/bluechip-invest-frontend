import { useReactiveVar } from '@apollo/client'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { shortAddress } from '../../utils'
import { accountVar } from '../../variables/AccountVariable'
import { Button } from './WalletButton'

export default function WalletConnected() {
  const account = useReactiveVar(accountVar)

  return (
    <Button>
      <Jazzicon diameter={24} seed={jsNumberForAddress(String(account?.address) || '0')} />
      <span>{shortAddress(String(account?.address), 6, -6)}</span>
    </Button>
  )
}
