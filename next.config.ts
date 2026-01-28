import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true
  },
  cacheComponents: true,
  experimental: {
    authInterrupts: true,
    inlineCss: true,
    viewTransition: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**"
      }
    ]
  }
}
export default nextConfig
