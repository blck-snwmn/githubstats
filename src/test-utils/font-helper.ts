import { readFile } from "node:fs/promises";

const testFontPath = `${process.cwd()}/src/test-utils/fixtures/inter-latin-400-normal.woff`;

let cachedFontData: ArrayBuffer | null = null;

export async function getTestFontData(): Promise<ArrayBuffer> {
  if (cachedFontData) {
    return cachedFontData;
  }

  const fontData = await readFile(testFontPath);
  cachedFontData = fontData.buffer.slice(
    fontData.byteOffset,
    fontData.byteOffset + fontData.byteLength,
  );
  return cachedFontData;
}
