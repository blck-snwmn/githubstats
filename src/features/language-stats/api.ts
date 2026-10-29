// API functions for language stats feature

import type { LanguageStats } from "../../types/language";
import type { GitHubUser, RepositoryListItem } from "../../services/github/types";
import { executeGitHubRestRequest } from "../../services/github/client";
import { getTopLanguages } from "../../shared/utils/language-utils";

const REPOSITORIES_PER_PAGE = 100;

// The repository list API is much faster than the search API, but only lists public repositories
function createRepositoryListPath(username: string, page: number): string {
  const params = new URLSearchParams({
    type: "owner",
    per_page: REPOSITORIES_PER_PAGE.toString(),
    page: page.toString(),
  });

  return `users/${encodeURIComponent(username)}/repos?${params.toString()}`;
}

function countPrimaryLanguages(repositories: RepositoryListItem[]): LanguageStats {
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
    const [user, firstPage] = await Promise.all([
      executeGitHubRestRequest<GitHubUser>(`users/${encodeURIComponent(username)}`, githubToken),
      executeGitHubRestRequest<RepositoryListItem[]>(
        createRepositoryListPath(username, 1),
        githubToken,
      ),
    ]);

    const pageCount = Math.ceil(user.public_repos / REPOSITORIES_PER_PAGE);
    const remainingPages = await Promise.all(
      Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
        executeGitHubRestRequest<RepositoryListItem[]>(
          createRepositoryListPath(username, index + 2),
          githubToken,
        ),
      ),
    );

    return countPrimaryLanguages([firstPage, ...remainingPages].flat());
  } catch (error) {
    console.error("Error fetching primary language stats:", error);
    throw error;
  }
}

// Re-export shared utility for convenience
export { getTopLanguages };
