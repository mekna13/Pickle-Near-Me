/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  turbopack: {
    resolveAlias: {
      'mapbox-gl': 'mapbox-gl',
    }
  }
}

module.exports = nextConfig