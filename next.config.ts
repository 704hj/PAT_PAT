import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // 브라우저 환경에서 fs 및 v8 모듈을 빈 객체로 설정
      config.node = {
        fs: "empty",
        v8: "empty",
      };
    }
    return config;
  },
};

export default nextConfig;
