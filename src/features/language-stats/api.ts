// API functions for language stats feature

import type { LanguageStats } from "../../types/language";
import type { RepositorySearchItem, RepositorySearchResponse } from "../../services/github/types";
import { executeGitHubRestRequest } from "../../services/github/client";
import { getTopLanguages } from "../../shared/utils/language-utils";

const REPOSITORIES_PER_PAGE = 100;
const MAX_SEARCH_RESULTS = 1000;

function createRepositorySearchPath(username: string, page: number): string {
  const params = new URLSearchParams({
    q: `user:${username} fork:false archived:false`,
    per_page: REPOSITORIES_PER_PAGE.toString(),
    page: page.toString(),
  });

  return `search/repositories?${params.toString()}`;
}

function countPrimaryLanguages(repositories: RepositorySearchItem[]): LanguageStats {
  const languageCounts: LanguageStats = {};

  for (const repository of repositories) {
    if (repository.fork || repository.archived || !repository.language) {
      continue;
    }

    languageCounts[repository.language] = (languageCounts[repository.language] ?? 0) + 1;
  }

  return languageCounts;
}

export async function fetchUserLanguageStats(
  username: string,
  githubToken?: string,
): Promise<LanguageStats> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  try {
    const firstPage = await executeGitHubRestRequest<RepositorySearchResponse>(
      createRepositorySearchPath(username, 1),
      githubToken,
    );

    if (firstPage.total_count > MAX_SEARCH_RESULTS) {
      throw new Error(`Repository search exceeds GitHub's ${MAX_SEARCH_RESULTS}-result limit`);
    }

    const pageCount = Math.ceil(firstPage.total_count / REPOSITORIES_PER_PAGE);
    const remainingPages = await Promise.all(
      Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
        executeGitHubRestRequest<RepositorySearchResponse>(
          createRepositorySearchPath(username, index + 2),
          githubToken,
        ),
      ),
    );
    const pages = [firstPage, ...remainingPages];

    if (pages.some((page) => page.incomplete_results)) {
      throw new Error("GitHub returned incomplete repository search results");
    }

    return countPrimaryLanguages(pages.flatMap((page) => page.items));
  } catch (error) {
    console.error("Error fetching primary language stats:", error);
    throw error;
  }
}

// Re-export shared utility for convenience
export { getTopLanguages };
