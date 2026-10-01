import { defineWranglerConfig, type WranglerConfig } from "wrangler/experimental-config";

export const wranglerConfig = {
  alias: {
    harfbuzzjs: "./src/shared/lib/harfbuzz-worker.ts",
  },
  define: {
    "process.versions.node": "undefined",
    "self.location.href": '"https://worker.invalid/"',
  },
  types: {
    generate: false,
  },
  assetsDirectory: "./public",
} satisfies WranglerConfig;

export default defineWranglerConfig(({ mode }) => ({
  ...wranglerConfig,
  minify: mode === "production",
}));
