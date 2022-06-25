import axios from 'axios'
import BigNumber from 'bignumber.js'
import { v4 as uuid } from 'uuid'
import { configByChain } from '../config'
import { units } from '../utils'
import { Account } from '../variables/AccountVariable'

export interface InvestmentService {
  create(collectionAddress: string, name: string, symbol: string): Promise<void>
  addMoney(investmentId: string, amount: string, reservePrice: string): Promise<void>
  removeAllMoney(investmentId: string): Promise<void>
}

export function investmentService(chainId: number, account: Account): InvestmentService {
  return {
    async create(collectionAddress: string, name: string, symbol: string) {
      // Reservoir Oracle API - Get Floor Price
      const oracle = await axios.get<{ tokens: { tokenId: string }[] }>(
        `${configByChain(chainId).reservoir.api}/tokens/bootstrap/v1?collection=${collectionAddress}&limit=50`
      )
      const tokenId = oracle.data.tokens[0].tokenId

      // OpenSea SeaPort - Validate Orders for NFT
      const nft = await axios.get<{ orders: { finalized: boolean }[] }>(
        `${configByChain(chainId).openSea.api}/orders/${
          configByChain(chainId).name
        }/seaport/listings?asset_contract_address=${collectionAddress}&token_ids=${tokenId}`
      )

      const nftIsValid = nft.data.orders.filter(order => !order.finalized).length > 0

      if (nftIsValid && account) {
        const web3 = account.web3

        const typeBytes = web3.utils.asciiToHex('AUCTION')
        const communityFeeUnits = units(Number(0).toString(10), 18)
        const curatorsFeePercentage = 0 / 100
        const curatorsFeeUnits = units(curatorsFeePercentage.toString(10), 18)
        const duration = 259200
        const multiplier = new BigNumber(1.1).multipliedBy(100).toNumber()
        const payment = '0x0000000000000000000000000000000000000000'

        const extras = web3.eth.abi.encodeParameters(
          ['bytes32', 'string', 'string', 'uint256', 'uint256'],
          [typeBytes, `${name} ${tokenId} Investment`, `${symbol}I`, duration, communityFeeUnits]
        )

        // Tatum - Prepare Transaction
        const prepareTx = await axios.post<{ signatureId: string }>(
          `${configByChain(chainId).tatum.api}/ethereum/smartcontract`,
          {
            contractAddress: configByChain(chainId).contracts.investment,
            methodName: 'list',
            methodABI: {
              inputs: [
                { internalType: 'address', name: '_collection', type: 'address' },
                { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
                { internalType: 'bool', name: '_listed', type: 'bool' },
                { internalType: 'uint256', name: '_fee', type: 'uint256' },
                { internalType: 'address', name: '_paymentToken', type: 'address' },
                { internalType: 'uint256', name: '_priceMultiplier', type: 'uint256' },
                { internalType: 'bytes', name: '_extra', type: 'bytes' }
              ],
              name: 'list',
              outputs: [{ internalType: 'uint256', name: '_listingId', type: 'uint256' }],
              stateMutability: 'nonpayable',
              type: 'function'
            },
            params: [collectionAddress, Number(tokenId), true, curatorsFeeUnits, payment, multiplier, extras],
            signatureId: uuid(),
            fee: {
              gasLimit: '1000000',
              gasPrice: '50'
            }
          },
          {
            headers: {
              'x-api-key': configByChain(chainId).tatum.key,
              'x-testnet-type': 'ethereum-rinkeby'
            }
          }
        )

        const { signatureId } = prepareTx.data

        // Tatum - Prepare Signature
        const { data } = await axios.get(`${configByChain(chainId).tatum.api}/kms/${signatureId}`, {
          headers: {
            'x-api-key': configByChain(chainId).tatum.key,
            'x-testnet-type': 'ethereum-rinkeby'
          }
        })

        const txConfig = JSON.parse(data.serializedTransaction)
        txConfig.from = account.address
        txConfig.gasPrice = txConfig.gasPrice ? parseInt(txConfig.gasPrice).toString(10) : undefined

        // Wallet Connect - Execute Transaction
        const tx = await account.web3.eth.sendTransaction(txConfig)

        console.log(tx)
      } else {
        console.error('Reservoir Oracle not found NFT')
      }

      // IPFS - Save Investment
    },
    async addMoney(investmentId: string, amount: string, reservePrice: string) {
      // Tatum - Prepare Transaction
      const prepareTx = await axios.post<{ signatureId: string }>(
        `${configByChain(chainId).tatum.api}/ethereum/smartcontract`,
        {
          contractAddress: configByChain(chainId).contracts.investment,
          methodName: 'join',
          methodABI: {
            inputs: [
              { internalType: 'uint256', name: '_listingId', type: 'uint256' },
              { internalType: 'uint256', name: '_amount', type: 'uint256' },
              { internalType: 'uint256', name: '_maxReservePrice', type: 'uint256' }
            ],
            name: 'join',
            outputs: [],
            stateMutability: 'payable',
            type: 'function'
          },
          params: [investmentId, amount, reservePrice],
          signatureId: uuid(),
          fee: {
            gasLimit: '300000',
            gasPrice: '50'
          }
        },
        {
          headers: {
            'x-api-key': configByChain(chainId).tatum.key,
            'x-testnet-type': 'ethereum-rinkeby'
          }
        }
      )

      const { signatureId } = prepareTx.data

      // Tatum - Prepare Signature
      const { data } = await axios.get(`${configByChain(chainId).tatum.api}/kms/${signatureId}`, {
        headers: {
          'x-api-key': configByChain(chainId).tatum.key,
          'x-testnet-type': 'ethereum-rinkeby'
        }
      })

      const txConfig = JSON.parse(data.serializedTransaction)
      txConfig.from = account.address
      txConfig.value = amount
      const tx = await account.web3.eth.sendTransaction(txConfig)

      console.log('tx', tx)
    },
    async removeAllMoney(investmentId: string) {
      // Tatum - Prepare Transaction
      const prepareTx = await axios.post<{ signatureId: string }>(
        `${configByChain(chainId).tatum.api}/ethereum/smartcontract`,
        {
          contractAddress: configByChain(chainId).contracts.investment,
          methodName: 'leave',
          methodABI: {
            inputs: [{ internalType: 'uint256', name: '_listingId', type: 'uint256' }],
            name: 'leave',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
          },
          params: [investmentId],
          signatureId: uuid(),
          fee: {
            gasLimit: '300000',
            gasPrice: '50'
          }
        },
        {
          headers: {
            'x-api-key': configByChain(chainId).tatum.key,
            'x-testnet-type': 'ethereum-rinkeby'
          }
        }
      )

      const { signatureId } = prepareTx.data

      // Tatum - Prepare Signature
      const { data } = await axios.get(`${configByChain(chainId).tatum.api}/kms/${signatureId}`, {
        headers: {
          'x-api-key': configByChain(chainId).tatum.key,
          'x-testnet-type': 'ethereum-rinkeby'
        }
      })

      const txConfig = JSON.parse(data.serializedTransaction)
      txConfig.from = account.address
      const tx = await account.web3.eth.sendTransaction(txConfig)

      console.log('tx', tx)
    }
  }
}
