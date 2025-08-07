// API functions for language stats feature

import type { LanguageStats } from "../../types/language";
import type { UserRepositoriesData, RepositoryNode } from "../../services/github/types";
import { executeGraphQLQuery } from "../../services/github/client";
import { USER_LANGUAGE_QUERY } from "../../services/github/queries";
import { processLanguageData, getTopLanguages } from "../../shared/utils/language-utils";

export async function fetchUserLanguageStats(
  username: string,
  githubToken?: string,
): Promise<LanguageStats> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  const allLanguageBytes: LanguageStats = {};
  let hasNextPage = true;
  let cursor: string | null = null;

  try {
    while (hasNextPage) {
      // eslint-disable-next-line no-await-in-loop
      const response: UserRepositoriesData = await executeGraphQLQuery<UserRepositoriesData>(
        USER_LANGUAGE_QUERY,
        { username, cursor },
        githubToken,
      );

      const repositories = response.user.repositories;
      if (!repositories) {
        throw new Error("User not found or no repositories");
      }

      // Process and merge language data
      const pageLanguageBytes = processLanguageData(
        repositories.edges.map((edge: { node: RepositoryNode }) => edge.node),
      );

      for (const [language, bytes] of Object.entries(pageLanguageBytes)) {
        allLanguageBytes[language] = (allLanguageBytes[language] || 0) + bytes;
      }

      hasNextPage = repositories.pageInfo.hasNextPage;
      cursor = repositories.pageInfo.endCursor;
    }

    return allLanguageBytes;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
}

// Re-export shared utility for convenience
export { getTopLanguages };
