if (!process.env.NEXT_PUBLIC_INFURA_KEY) {
  throw new Error('Missing NEXT_PUBLIC_INFURA_KEY environment variable')
}

console.log('NEXT_PUBLIC_INFURA_KEY', process.env.NEXT_PUBLIC_INFURA_KEY)

export interface ChainConfig {
  id: number
  name: string
  infura: {
    api: string
    key: string
  }
}

export const chainConfig: ChainConfig[] = [
  {
    id: 1,
    name: 'ethereum',
    infura: {
      api: 'https://mainnet.infura.io/v3',
      key: process.env.NEXT_PUBLIC_INFURA_KEY
    }
  },
  {
    id: 4,
    name: 'rinkeby',
    infura: {
      api: 'https://rinkeby.infura.io/v3',
      key: process.env.NEXT_PUBLIC_INFURA_KEY
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
