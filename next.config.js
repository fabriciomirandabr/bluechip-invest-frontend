/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/investment/1',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
