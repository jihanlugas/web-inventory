/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    APP_NAME: process.env.APP_NAME,
    COOKIE_NAME: process.env.COOKIE_NAME,
    API_END_POINT: process.env.API_END_POINT,
  },
  i18n: {
    // providing the locales supported by your application
    locales: ['en', 'id'],
    //  default locale used when the non-locale paths are visited
    defaultLocale: 'en',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sign-in',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig
