import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboards/teacher',
        permanent: false
      },
      {
        source: '/en',
        destination: '/dashboards/teacher',
        permanent: false
      },
      {
        source: '/en/',
        destination: '/dashboards/teacher',
        permanent: false
      },
      {
        source: '/en/login',
        destination: '/login',
        permanent: false
      },
      {
        source: '/en/dashboards/crm',
        destination: '/dashboards/teacher',
        permanent: false
      },
      {
        source: '/en/:path*',
        destination: '/:path*',
        permanent: false
      }
    ]
  }
}

export default nextConfig
