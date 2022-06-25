import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'
import { GQLClient } from '../graphql/GQLClient'
import '../styles/reset.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={GQLClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
