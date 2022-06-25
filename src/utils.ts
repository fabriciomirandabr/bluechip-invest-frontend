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
  if (!lastPart) {
    return `${addressFormat.slice(0, firstPart)}`
  }

  return `${addressFormat.slice(0, firstPart)}...${addressFormat.slice(lastPart)}`
}
