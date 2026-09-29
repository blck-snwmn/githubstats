import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import { wranglerConfig } from "./wrangler.config";

process.env.GITHUB_TOKEN ??= "test-token";

const require = createRequire(import.meta.url);
const testFont = readFileSync(
  require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff"),
).toString("base64");

// Share Wrangler build aliases with Vite to test the production dependency graph.
const alias = Object.entries(wranglerConfig.alias ?? {})
  .filter((entry): entry is [string, string] => typeof entry[1] === "string")
  .map(([name, target]) => ({
    find: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
    replacement: resolve(process.cwd(), target),
  }));

export default defineConfig({
  plugins: [
    cloudflareTest({
      experimental: {
        newConfig: true,
      },
      miniflare: {
        bindings: {
          TEST_FONT_BASE64: testFont,
        },
      },
    }),
  ],
  define: wranglerConfig.define,
  test: {
    include: ["tests/workers/**/*.workerd.tsx"],
  },
  resolve: {
    alias,
  },
});
