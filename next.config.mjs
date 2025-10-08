/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboards/crm',
        permanent: true
      }
    ]
  }
}

export default nextConfig
