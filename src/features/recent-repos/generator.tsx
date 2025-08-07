import type { BaseSVGOptions } from "../../types/svg-options";
import { fetchRecentRepositories } from "./api";
import { RecentReposStats } from "./components/RecentReposStats";
import { loadInterFonts } from "../../shared/lib/font-loader";
import { generateSVG } from "../../shared/lib/svg-generator";

export async function generateRecentReposSVG({
  username,
  githubToken,
}: BaseSVGOptions): Promise<string> {
  // Fetch fonts and repositories in parallel
  const [fonts, repositories] = await Promise.all([
    loadInterFonts(),
    fetchRecentRepositories(username, githubToken),
  ]);

  // Generate SVG using shared generator
  const svg = await generateSVG(<RecentReposStats repositories={repositories} />, {
    width: 400,
    height: 200,
    fonts: fonts,
  });

  return svg;
}
