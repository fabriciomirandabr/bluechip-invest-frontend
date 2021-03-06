export const chainToName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'ethereum'
    case 4:
      return 'rinkeby'
    default:
      return 'unknown'
  }
}

export function shortAddress(addressFormat: string, firstPart = 5, lastPart?: number): string {
  if (!addressFormat) {
    return ''
  }

  if (!lastPart) {
    return `${addressFormat.slice(0, firstPart)}`
  }

  return `${addressFormat.slice(0, firstPart)}...${addressFormat.slice(lastPart)}`
}

export function units(coinsValue: string, decimals: number): string {
  if (!valid(coinsValue, decimals)) throw new Error('Invalid amount')
  let i = coinsValue.indexOf('.')
  if (i < 0) i = coinsValue.length
  const s = coinsValue.slice(i + 1)
  return coinsValue.slice(0, i) + s + '0'.repeat(decimals - s.length)
}

export function coins(unitsValue: string, decimals: number): string {
  if (!valid(unitsValue, 0)) throw new Error('Invalid amount')
  if (decimals === 0) return unitsValue
  const s = unitsValue.padStart(1 + decimals, '0')
  return `${s.slice(0, -decimals)}.${s.slice(-decimals)}`
}

export function valid(amount: string, decimals: number): boolean {
  const regex = new RegExp(`^\\d+${decimals > 0 ? `(\\.\\d{1,${decimals}})?` : ''}$`)
  return regex.test(amount)
}
