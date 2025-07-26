import type { BaseSVGOptions } from "../types/svg-options";
import { fetchRecentLanguageStats, getTopLanguages } from "./github-api";
import { RecentLanguageStats } from "../components/RecentLanguageStats";
import { loadInterRegular } from "./font-loader";
import { generateSVG } from "./svg-generator";

export async function generateRecentLanguagesSVG({
  username,
  githubToken,
}: BaseSVGOptions): Promise<string> {
  // Fetch font and language stats in parallel
  const [font, languageStats] = await Promise.all([
    loadInterRegular(),
    fetchRecentLanguageStats(username, githubToken),
  ]);

  const topLanguages = getTopLanguages(languageStats, 3);

  // Generate SVG using shared generator
  const svg = await generateSVG(<RecentLanguageStats languages={topLanguages} />, {
    width: 400,
    height: 200,
    fonts: font,
  });

  return svg;
}
