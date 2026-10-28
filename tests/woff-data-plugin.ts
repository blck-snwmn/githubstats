import { readFileSync } from "node:fs";
import type { Plugin } from "vitest/config";

// Vitest does not apply Wrangler module rules, so mirror the `Data` rule for
// `.woff` files from wrangler.config.ts and import them as ArrayBuffer.
export function woffDataPlugin(): Plugin {
  return {
    name: "woff-as-data",
    enforce: "pre",
    load(id) {
      if (!id.endsWith(".woff")) {
        return null;
      }

      const base64 = readFileSync(id).toString("base64");
      return `export default Uint8Array.from(atob(${JSON.stringify(base64)}), (c) => c.charCodeAt(0)).buffer;`;
    },
  };
}
