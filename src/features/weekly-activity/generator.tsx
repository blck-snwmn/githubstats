import type { BaseSVGOptions } from "../../types/svg-options";
import { loadInterFonts } from "../../shared/lib/font-loader";
import { generateSVG } from "../../shared/lib/svg-generator";
import { fetchWeeklyActivity } from "./api";
import { WeeklyActivityStats } from "./components/WeeklyActivityStats";

export async function generateWeeklyActivitySVG({
  username,
  githubToken,
}: BaseSVGOptions): Promise<string> {
  const [fonts, repositories] = await Promise.all([
    loadInterFonts(),
    fetchWeeklyActivity(username, githubToken),
  ]);

  const svg = await generateSVG(<WeeklyActivityStats repositories={repositories} />, {
    width: 400,
    height: 200,
    fonts,
  });

  return svg;
}
