/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // exportPathMap: function () {
  //   return {
  //     '/': { page: '/' },
  //     '/forgot-password': { page: '/forgot-password' },
  //   }
  // },
  // trailingSlash: true,
  serverRuntimeConfig: {
    secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'development'
      ? 'https://beta-api.outreachapp.org' // development api
      : 'https://beta-api.outreachapp.org' // production api
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreBuildErrors: true,

  }
}
