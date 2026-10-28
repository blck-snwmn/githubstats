// Font loader for Satori SVG generation

import inter400 from "@fontsource/inter/files/inter-latin-400-normal.woff";
import inter700 from "@fontsource/inter/files/inter-latin-700-normal.woff";

// Satori font weight type
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: "normal" | "italic";
}

// Load Inter font with regular weight (400)
export async function loadInterRegular(): Promise<FontData> {
  return {
    name: "Inter",
    data: inter400,
    weight: 400,
    style: "normal",
  };
}

// Load Inter font with bold weight (700)
export async function loadInterBold(): Promise<FontData> {
  return {
    name: "Inter",
    data: inter700,
    weight: 700,
    style: "normal",
  };
}

// Load all Inter fonts (regular and bold)
export async function loadInterFonts(): Promise<FontData[]> {
  const [regular, bold] = await Promise.all([loadInterRegular(), loadInterBold()]);
  return [bold, regular]; // Bold first for Satori's font matching
}
