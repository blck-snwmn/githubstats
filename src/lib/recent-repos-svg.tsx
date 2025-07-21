import type { BaseSVGOptions } from "../types/svg-options";
import { fetchRecentRepositories } from "./github-api";
import { RecentReposStats } from "../components/RecentReposStats";
import { loadInterRegular } from "./font-loader";
import { generateSVG } from "./svg-generator";

export async function generateRecentReposSVG({
  username,
  githubToken,
}: BaseSVGOptions): Promise<string> {
  // Fetch font and repositories in parallel
  const [font, repositories] = await Promise.all([
    loadInterRegular(),
    fetchRecentRepositories(username, githubToken),
  ]);

  // Generate SVG using shared generator
  const svg = await generateSVG(<RecentReposStats repositories={repositories} />, {
    width: 400,
    height: 200,
    fonts: font,
  });

  return svg;
}
