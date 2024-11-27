import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public', // PWA関連ファイルの出力先
  disable: process.env.NODE_ENV === 'development', // 開発環境では無効化
  images: {
    domains: ['upload.wikimedia.org'], // 外部ドメインを許可
  },
  reactStrictMode: true, // 他の設定
});

export default nextConfig;