import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import { fileURLToPath } from "url";

// ESM 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs", options: {} },
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
      "@": path.resolve(__dirname, ".."),
    };
    return config;
  },
};

export default config;
