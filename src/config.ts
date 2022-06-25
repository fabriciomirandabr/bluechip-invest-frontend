if (!process.env.NEXT_PUBLIC_INFURA_KEY) {
  throw new Error('Missing NEXT_PUBLIC_INFURA_KEY environment variable')
}

if (!process.env.NEXT_PUBLIC_OPENSEA_KEY) {
  throw new Error('Missing NEXT_PUBLIC_OPENSEA_KEY environment variable')
}

if (!process.env.NEXT_PUBLIC_TATUM_KEY) {
  throw new Error('Missing NEXT_PUBLIC_TATUM_KEY environment variable')
}

if (!process.env.NEXT_PUBLIC_TATUM_TESTNET_KEY) {
  throw new Error('Missing NEXT_PUBLIC_TATUM_KEY environment variable')
}

if (!process.env.NEXT_PUBLIC_INVESTMENT_CONTRACT) {
  throw new Error('Missing NEXT_PUBLIC_INVESTMENT_CONTRACT environment variable')
}

if (!process.env.NEXT_PUBLIC_CLOSE_INVESTMENT_CONTRACT) {
  throw new Error('Missing NEXT_PUBLIC_CLOSE_INVESTMENT_CONTRACT environment variable')
}

export interface GlobalConfig {
  infura: {
    key: string
  }
}

export const globalConfig: GlobalConfig = {
  infura: {
    key: process.env.NEXT_PUBLIC_INFURA_KEY
  }
}

export interface ChainConfig {
  id: number
  name: string
  infura: {
    api: string
    key: string
  }
  reservoir: {
    api: string
  }
  openSea: {
    api: string
    key: string
  }
  tatum: {
    api: string
    key: string
  }
  contracts: {
    investment: string
    closeInvestment: string
  }
}

export const chainConfig: ChainConfig[] = [
  {
    id: 1,
    name: 'ethereum',
    infura: {
      api: 'https://mainnet.infura.io/v3',
      key: process.env.NEXT_PUBLIC_INFURA_KEY
    },
    reservoir: {
      api: 'https://api.reservoir.tools'
    },
    openSea: {
      api: 'https://api.opensea.io/v2',
      key: process.env.NEXT_PUBLIC_OPENSEA_KEY
    },
    tatum: {
      api: 'https://api-eu1.tatum.io/v3',
      key: process.env.NEXT_PUBLIC_TATUM_KEY
    },
    contracts: {
      investment: process.env.NEXT_PUBLIC_INVESTMENT_CONTRACT,
      closeInvestment: process.env.NEXT_PUBLIC_CLOSE_INVESTMENT_CONTRACT
    }
  },
  {
    id: 4,
    name: 'rinkeby',
    reservoir: {
      api: 'https://api-rinkeby.reservoir.tools'
    },
    infura: {
      api: 'https://rinkeby.infura.io/v3',
      key: process.env.NEXT_PUBLIC_INFURA_KEY
    },
    openSea: {
      api: 'https://testnets-api.opensea.io/v2',
      key: process.env.NEXT_PUBLIC_OPENSEA_KEY
    },
    tatum: {
      api: 'https://api-eu1.tatum.io/v3',
      key: process.env.NEXT_PUBLIC_TATUM_TESTNET_KEY
    },
    contracts: {
      investment: process.env.NEXT_PUBLIC_INVESTMENT_CONTRACT,
      closeInvestment: process.env.NEXT_PUBLIC_CLOSE_INVESTMENT_CONTRACT
    }
  }
]

export const configByChain = (id: number): ChainConfig => {
  const config = chainConfig.find(chain => chain.id === id)

  if (!config) {
    throw new Error('No Config')
  }

  return config
}
