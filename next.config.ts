import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        v8: false,
      };
    }

    // 캐시 끄기
    config.cache = false;

    return config;
  },
};

export default nextConfig;
