import satori from "satori";
import { fetchRecentRepositories } from "./github-api";
import { RecentReposStats } from "../components/RecentReposStats";
import { loadInterRegular } from "./font-loader";

interface GenerateRecentReposSVGOptions {
  username: string;
  githubToken?: string;
}

export async function generateRecentReposSVG({
  username,
  githubToken,
}: GenerateRecentReposSVGOptions): Promise<string> {
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
