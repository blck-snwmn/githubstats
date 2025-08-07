// API functions for recent languages feature

import type { LanguageStats } from "../../types/language";
import type { RecentRepositoriesData } from "../../services/github/types";
import { executeGraphQLQuery } from "../../services/github/client";
import { RECENT_LANGUAGE_QUERY } from "../../services/github/queries";
import { processLanguageData, getTopLanguages } from "../../shared/utils/language-utils";

export async function fetchRecentLanguageStats(
  username: string,
  githubToken?: string,
  repoLimit = 20,
): Promise<LanguageStats> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  try {
    const data = await executeGraphQLQuery<RecentRepositoriesData>(
      RECENT_LANGUAGE_QUERY,
      { username, repoLimit },
      githubToken,
    );

    if (!data.user?.repositories) {
      throw new Error("User not found or no repositories");
    }
    const repositories = data.user.repositories;

    // Process language data from recent repositories
    return processLanguageData(repositories.edges.map((edge) => edge.node));
  } catch (error) {
    console.error("Error fetching recent language stats:", error);
    throw error;
  }
}

// Re-export shared utility for convenience
export { getTopLanguages };
