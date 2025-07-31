import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // 브라우저에서 Node.js 내장 모듈을 제거
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        v8: false,
      };
    }
    return config;
  },
};

export default nextConfig;
