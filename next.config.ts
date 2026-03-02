import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 빌드 시 ESLint 스킵 (eslint-plugin-import v2 + ESLint v10 flat config 호환 이슈)
  // ESLint는 로컬에서 pnpm lint로 별도 실행
  eslint: { ignoreDuringBuilds: true },

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
