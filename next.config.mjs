/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "http", hostname: "**" }, { protocol: "https", hostname: "**" }]
  },
  output: 'export',
  trailingSlash: true,
  basePath: '/kp_aution_app',   // IMPORTANT
  assetPrefix: '/kp_aution_app/'
};

export default nextConfig;
