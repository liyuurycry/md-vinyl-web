/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 關閉嚴格模式以穩定 YouTube Player
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.youtube.com https://youtube.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;