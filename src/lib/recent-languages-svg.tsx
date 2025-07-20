import satori from "satori";
import { fetchRecentLanguageStats, getTopLanguages } from "./github-api";
import { RecentLanguageStats } from "../components/RecentLanguageStats";

interface GenerateRecentLanguagesSVGOptions {
  username: string;
  githubToken?: string;
}

export async function generateRecentLanguagesSVG({
  username,
  githubToken,
}: GenerateRecentLanguagesSVGOptions): Promise<string> {
  // Fetch font
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff",
  ).then((res) => res.arrayBuffer());

  // Fetch recent language stats
  const languageStats = await fetchRecentLanguageStats(username, githubToken);
  const topLanguages = getTopLanguages(languageStats, 3);

  // Generate SVG using Satori
  const svg = await satori(<RecentLanguageStats languages={topLanguages} />, {
    width: 400,
    height: 150,
    fonts: [
      {
        name: "Inter",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  return svg;
}
