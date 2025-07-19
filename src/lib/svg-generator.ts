import satori from "satori";
import { Card } from "../components/Card";

interface GenerateSVGOptions {
  title: string;
  description: string;
  author?: string;
  date?: string;
  width?: number;
  height?: number;
}

export async function generateSVG({
  title,
  description,
  author,
  date,
  width = 1200,
  height = 630,
}: GenerateSVGOptions): Promise<string> {
  // Fetch font data from fontsource
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff",
  ).then((res) => res.arrayBuffer());

  const svg = await satori(Card({ title, description, author, date }), {
    width,
    height,
    fonts: [
      {
        name: "Inter",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  });

  return svg;
}
