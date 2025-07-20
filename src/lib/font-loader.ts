// Font loader with caching for Satori SVG generation

// Satori font weight type
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: "normal" | "italic";
}

// Cache for loaded fonts
const fontCache = new Map<string, Promise<ArrayBuffer>>();

// Font URLs from jsDelivr CDN
const FONT_URLS = {
  inter400: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff",
  inter700: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff",
};

async function loadFont(url: string): Promise<ArrayBuffer> {
  const cached = fontCache.get(url);
  if (cached) {
    return cached;
  }

  const promise = fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch font: ${res.statusText}`);
    }
    return res.arrayBuffer();
  });

  fontCache.set(url, promise);
  return promise;
}

// Load Inter font with regular weight (400)
export async function loadInterRegular(): Promise<FontData> {
  const data = await loadFont(FONT_URLS.inter400);
  return {
    name: "Inter",
    data,
    weight: 400,
    style: "normal",
  };
}

// Load Inter font with bold weight (700)
export async function loadInterBold(): Promise<FontData> {
  const data = await loadFont(FONT_URLS.inter700);
  return {
    name: "Inter",
    data,
    weight: 700,
    style: "normal",
  };
}

// Load all Inter fonts (regular and bold)
export async function loadInterFonts(): Promise<FontData[]> {
  const [regular, bold] = await Promise.all([loadInterRegular(), loadInterBold()]);
  return [bold, regular]; // Bold first for Satori's font matching
}
