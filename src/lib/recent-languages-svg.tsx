import satori from "satori";
import { fetchRecentLanguageStats, getTopLanguages } from "./github-api";
import { RecentLanguageStats } from "../components/RecentLanguageStats";
import { loadInterRegular } from "./font-loader";

interface GenerateRecentLanguagesSVGOptions {
  username: string;
  githubToken?: string;
}

export async function generateRecentLanguagesSVG({
  username,
  githubToken,
}: GenerateRecentLanguagesSVGOptions): Promise<string> {
  // Fetch font and language stats in parallel
  const [font, languageStats] = await Promise.all([
    loadInterRegular(),
    fetchRecentLanguageStats(username, githubToken),
  ]);

  const topLanguages = getTopLanguages(languageStats, 3);

  // Generate SVG using Satori
  const svg = await satori(<RecentLanguageStats languages={topLanguages} />, {
    width: 400,
    height: 150,
    fonts: [font],
  });

  return svg;
}
