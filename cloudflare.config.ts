import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "githubstats",
    compatibilityDate: "2025-07-15",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "src/index.ts",
    workersDev: false,
    previewUrls: false,
    cache: {
      enabled: true,
      crossVersionCache: true,
    },
    observability: {
      enabled: true,
      traces: {
        enabled: true,
        headSamplingRate: 0.05,
      },
    },
    env: {
      GITHUB_USERNAME: bindings.text("blck-snwmn"),
      GITHUB_TOKEN: bindings.secret(),
      ASSETS: bindings.assets(),
    },
  },
});
