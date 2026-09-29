import { defineWranglerConfig, type WranglerConfig } from "wrangler/experimental-config";

export const wranglerConfig = {
  minify: true,
  alias: {
    harfbuzzjs: "./src/shared/lib/harfbuzz-worker.ts",
  },
  define: {
    "process.versions.node": "undefined",
    "self.location.href": '"https://worker.invalid/"',
  },
  types: {
    generate: true,
  },
  assetsDirectory: "./public",
} satisfies WranglerConfig;

export default defineWranglerConfig(wranglerConfig);
