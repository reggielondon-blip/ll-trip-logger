/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No backend: emit a fully static site into ./out for Netlify.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
module.exports = nextConfig;
