import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { globalConfig } from '../../config'
import { useAccount } from '../../hooks/useAccount'
import { chainToName } from '../../utils'
import { Account } from '../../variables/AccountVariable'

export default function WalletButton() {
  const { setAccount } = useAccount()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const onClick = () => setOpenModal(true)

  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: globalConfig.infura.key
        }
      }
    }

    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions
    })

    const onConnect = async () => {
      if (openModal && web3Modal) {
        const provider = await web3Modal.connect()
        const web3 = initWeb3(provider)

        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]

        const chainId = Number(await web3.eth.chainId())

        const account = {
          address,
          chainId,
          chainName: chainToName(chainId),
          web3
        }

        setAccount(account)
        listenEvents(provider, account)
      }

      if (web3Modal) {
        web3Modal.on('connect', provider => {
          console.log('connected', provider)
        })
        web3Modal.on('disconnect', provider => {
          console.log('disconnected', provider)
        })
        web3Modal.on('close', provider => {
          console.log('closed', provider)
        })
      }
    }

    const initWeb3 = (provider: any) => {
      const web3: any = new Web3(provider)

      web3.eth.extend({
        methods: [
          {
            name: 'chainId',
            call: 'eth_chainId',
            outputFormatter: web3.utils.hexToNumber
          }
        ]
      })

      return web3
    }

    const listenEvents = async (provider: any, account: Account) => {
      if (!provider.on) {
        return
      }
      provider.on('accountsChanged', async (accounts: string[]) => {
        const address = accounts[0]
        const { web3 } = account
        const chainId = await web3.eth.net.getId()
        setAccount({
          ...account,
          address,
          chainId,
          chainName: chainToName(chainId)
        })
      })
      provider.on('chainChanged', async () => {
        const { web3 } = account
        const chainId = await web3.eth.net.getId()
        setAccount({
          ...account,
          chainId,
          chainName: chainToName(chainId)
        })
      })
    }

    onConnect()
  }, [openModal, setAccount])

  return <button onClick={onClick}>Connect Wallet</button>
}
