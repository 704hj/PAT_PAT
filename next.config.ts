import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 모드에서 StrictMode 끄기
  // useEffect 개발모드에서 1회 실행
  reactStrictMode: false,

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
