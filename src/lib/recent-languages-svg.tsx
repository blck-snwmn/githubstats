import type { BaseSVGOptions } from "../types/svg-options";
import { fetchRecentLanguageStats, getTopLanguages } from "./github-api";
import { RecentLanguageStats } from "../components/RecentLanguageStats";
import { loadInterFonts } from "./font-loader";
import { generateSVG } from "./svg-generator";

export async function generateRecentLanguagesSVG({
  username,
  githubToken,
}: BaseSVGOptions): Promise<string> {
  // Fetch fonts and language stats in parallel
  const [fonts, languageStats] = await Promise.all([
    loadInterFonts(),
    fetchRecentLanguageStats(username, githubToken),
  ]);

  const topLanguages = getTopLanguages(languageStats, 3);

  // Generate SVG using shared generator
  const svg = await generateSVG(<RecentLanguageStats languages={topLanguages} />, {
    width: 400,
    height: 200,
    fonts: fonts,
  });

  return svg;
}
