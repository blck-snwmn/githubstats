let cachedFontData: ArrayBuffer | null = null;

export async function getTestFontData(): Promise<ArrayBuffer> {
  if (cachedFontData) {
    return cachedFontData;
  }

  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff",
  );
  cachedFontData = await response.arrayBuffer();
  return cachedFontData;
}
