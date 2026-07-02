/// <reference types="node" />

import { readFile } from "node:fs/promises";
import { vi } from "vitest";

const fontResponses = new Map([
  [
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff",
    `${process.cwd()}/node_modules/@fontsource/inter/files/inter-latin-400-normal.woff`,
  ],
  [
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff",
    `${process.cwd()}/node_modules/@fontsource/inter/files/inter-latin-700-normal.woff`,
  ],
]);

const originalFetch = globalThis.fetch;

vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" || input instanceof URL ? input.toString() : input.url;
  const fontPath = fontResponses.get(url);

  if (fontPath) {
    const fontData = await readFile(fontPath);
    return new Response(fontData);
  }

  return originalFetch(input, init);
});
