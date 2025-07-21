import satori from "satori";
import type { BaseSVGOptions } from "../types/svg-options";
import { fetchRecentRepositories } from "./github-api";
import { RecentReposStats } from "../components/RecentReposStats";
import { loadInterRegular } from "./font-loader";

export async function generateRecentReposSVG({
  username,
  githubToken,
}: BaseSVGOptions): Promise<string> {
  // Fetch font and repositories in parallel
  const [font, repositories] = await Promise.all([
    loadInterRegular(),
    fetchRecentRepositories(username, githubToken),
  ]);

  // Generate SVG using Satori
  const svg = await satori(<RecentReposStats repositories={repositories} />, {
    width: 400,
    height: 200,
    fonts: [font],
  });

  return svg;
}
