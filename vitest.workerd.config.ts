import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vitest/config";
import { unstable_readConfig } from "wrangler";

process.env.GITHUB_TOKEN ??= "test-token";

const wranglerConfigPath = resolve(process.cwd(), "wrangler.jsonc");
const wranglerConfig = unstable_readConfig({ config: wranglerConfigPath }, { hideWarnings: true });
const require = createRequire(import.meta.url);
const testFont = readFileSync(
  require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff"),
).toString("base64");

// The Workers Vitest plugin does not currently translate Wrangler module aliases
// into Vite aliases, so mirror them to exercise the production dependency graph.
const alias = Object.entries(wranglerConfig.alias ?? {})
  .filter((entry): entry is [string, string] => typeof entry[1] === "string")
  .map(([name, target]) => ({
    find: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
    replacement: resolve(dirname(wranglerConfigPath), target),
  }));

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: {
        configPath: "./wrangler.jsonc",
      },
      miniflare: {
        bindings: {
          TEST_FONT_BASE64: testFont,
        },
      },
    }),
  ],
  test: {
    include: ["tests/workers/**/*.workerd.tsx"],
  },
  resolve: {
    alias,
  },
});
