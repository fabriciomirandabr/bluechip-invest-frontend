import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { globalConfig } from '../config'

export const GQLClient = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: new HttpLink({
    uri: globalConfig.backend.api
  }),
  cache: new InMemoryCache()
})
