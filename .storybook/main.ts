import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import { fileURLToPath } from "url";

let __dirnameGlobal: string;

if (typeof __dirname !== "undefined") {
  // CommonJS 환경
  __dirnameGlobal = __dirname;
} else {
  // ESM 환경
  const __filename = fileURLToPath(import.meta.url);
  __dirnameGlobal = path.dirname(__filename);
}

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs", options: {} },
  //스토리 파일 위치 정의
  stories: [
    "../stories/**/*.stories.@(ts|tsx|mdx)",
    "../app/**/*.stories.@(ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
  ],
  features: {
    // @ts-ignore
    autodocs: true,
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirnameGlobal, ".."),
    };
    return config;
  },
};

export default config;
