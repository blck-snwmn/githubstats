import satori from "satori";
import { fetchRecentRepositories } from "./github-api";
import { RecentReposStats } from "../components/RecentReposStats";

interface GenerateRecentReposSVGOptions {
  username: string;
  githubToken?: string;
}

export async function generateRecentReposSVG({
  username,
  githubToken,
}: GenerateRecentReposSVGOptions): Promise<string> {
  // Fetch font
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff",
  ).then((res) => res.arrayBuffer());

  // Fetch recent repositories
  const repositories = await fetchRecentRepositories(username, githubToken);

  // Generate SVG using Satori
  const svg = await satori(<RecentReposStats repositories={repositories} />, {
    width: 400,
    height: 200,
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
