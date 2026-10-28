import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import { woffDataPlugin } from "./tests/woff-data-plugin";
import { wranglerConfig } from "./wrangler.config";

process.env.GITHUB_TOKEN ??= "test-token";

// The Workers Vitest plugin does not currently translate Wrangler module aliases
// into Vite aliases, so mirror them to exercise the production dependency graph.
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
    }),
    woffDataPlugin(),
  ],
  define: wranglerConfig.define,
  test: {
    include: ["tests/workers/**/*.workerd.tsx"],
  },
  resolve: {
    alias,
  },
});
