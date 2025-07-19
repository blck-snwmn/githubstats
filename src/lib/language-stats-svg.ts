import satori from "satori";
import { CompactLanguageStats } from "../components/CompactLanguageStats";
import { fetchUserLanguageStats, getTopLanguages } from "./github-api";

interface GenerateLanguageStatsSVGOptions {
  username: string;
  githubToken?: string;
  width?: number;
  height?: number;
}

export async function generateLanguageStatsSVG({
  username,
  githubToken,
  width = 400,
  height = 200,
}: GenerateLanguageStatsSVGOptions): Promise<string> {
  // Fetch language statistics
  const languageStats = await fetchUserLanguageStats(username, githubToken);
  const topLanguages = getTopLanguages(languageStats, 6);

  // Fetch font data
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff",
  ).then((res) => res.arrayBuffer());

  const regularFontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff",
  ).then((res) => res.arrayBuffer());

  const svg = await satori(CompactLanguageStats({ username, languages: topLanguages }), {
    width,
    height,
    fonts: [
      {
        name: "Inter",
        data: fontData,
        weight: 700,
        style: "normal",
      },
      {
        name: "Inter",
        data: regularFontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  return svg;
}
