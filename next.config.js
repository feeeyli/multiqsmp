/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
        port: '',
        pathname: '/jtv_user_pictures/*',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 's.namemc.com',
        port: '',
        pathname: '/2d/skin/face.png',
      },
    ],
  },
};

module.exports = nextConfig;
