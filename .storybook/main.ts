// .storybook/main.ts
import path from "path";

export default {
  framework: "@storybook/nextjs",
  stories: [
    "../stories/**/*.stories.@(ts|tsx|mdx)",
    "../app/**/*.stories.@(ts|tsx|mdx)",
    // 필요하면 아래를 나중에 추가
    // '../components/**/*.stories.@(ts|tsx|mdx)',
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
  ],
  docs: { autodocs: "tag" },
  webpackFinal: async (config: any) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, ".."), // 프로젝트 루트 경로
    };
    return config;
  },
};
