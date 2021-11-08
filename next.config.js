/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://beta-api.outreachapp.org/:path*',
      },
    ]
  },

}
