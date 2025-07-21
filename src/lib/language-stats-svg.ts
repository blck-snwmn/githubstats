import satori from "satori";
import type { SVGOptionsWithDimensions } from "../types/svg-options";
import { CompactLanguageStats } from "../components/CompactLanguageStats";
import { fetchUserLanguageStats, getTopLanguages } from "./github-api";
import { loadInterFonts } from "./font-loader";

export async function generateLanguageStatsSVG({
  username,
  githubToken,
  width = 400,
  height = 200,
}: SVGOptionsWithDimensions): Promise<string> {
  // Fetch language statistics and fonts in parallel
  const [languageStats, fonts] = await Promise.all([
    fetchUserLanguageStats(username, githubToken),
    loadInterFonts(),
  ]);

  const topLanguages = getTopLanguages(languageStats, 6);

  const svg = await satori(CompactLanguageStats({ username, languages: topLanguages }), {
    width,
    height,
    fonts,
  });

  return svg;
}
