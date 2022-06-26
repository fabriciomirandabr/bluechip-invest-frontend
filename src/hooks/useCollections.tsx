export default function useCollections(chainId: number) {
  if (chainId === 4) {
    return [
      '0x46bEF163D6C470a4774f9585F3500Ae3b642e751',
      '0x7b404C05733344eA9a618b95B21Ad27090B53456',
      '0x7dca125b1e805dC88814aeD7ccc810f677d3E1DB'
    ]
  }

  return [
    '0x60E4d786628Fea6478F785A6d7e704777c86a7c6', // bored ape
    '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e', // doodle
    '0xED5AF388653567Af2F388E6224dC7C4b3241C544' // azuki
  ]
}
