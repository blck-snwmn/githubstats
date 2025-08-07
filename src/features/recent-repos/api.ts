// API functions for recent repos feature

import type { RecentRepository, RecentRepositoriesQueryData } from "../../services/github/types";
import { executeGraphQLQuery } from "../../services/github/client";
import { RECENT_REPOSITORIES_QUERY } from "../../services/github/queries";

export async function fetchRecentRepositories(
  username: string,
  githubToken?: string,
  limit = 5,
): Promise<RecentRepository[]> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  try {
    const data = await executeGraphQLQuery<RecentRepositoriesQueryData>(
      RECENT_REPOSITORIES_QUERY,
      { username, limit },
      githubToken,
    );

    if (!data.user?.repositories) {
      throw new Error("User not found or no repositories");
    }
    const repositories = data.user.repositories;

    return repositories.edges.map((edge) => edge.node);
  } catch (error) {
    console.error("Error fetching recent repositories:", error);
    throw error;
  }
}
