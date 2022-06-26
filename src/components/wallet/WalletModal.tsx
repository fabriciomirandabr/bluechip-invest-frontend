import { useReactiveVar } from '@apollo/client'

import { useEffect } from 'react'
import styled from 'styled-components'
import { useAccount } from '../../hooks/useAccount'

import { transactionService } from '../../services/TransactionService'
import { colors } from '../../styles/theme'
import { loadingVar, transactionVar } from '../../variables/TransactionVariable'

export function WalletModal() {
  const transaction = useReactiveVar(transactionVar)
  const loading = useReactiveVar(loadingVar)
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

  return (
    <>
      {loading && (
        <Container>
          <p>Processing Transaction</p>
        </Container>
      )}
    </>
  )
}

export const { Container } = {
  Container: styled.div`
    text-align: center;
    padding: 8px 0;
    background: ${colors.blue[400]};
    color: ${colors.white};
    position: absolute;
    width: 100%;
    box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.15);

    background: linear-gradient(-45deg, #a7c9fd, #598cf4, #1b4acb, #1236aa);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;

    @keyframes gradient {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    p {
      font-family: 'Quicksand', sans-serif;
      font-size: 14px;
    }
  `
}
