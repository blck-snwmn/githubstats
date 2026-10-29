import type {
  WeeklyActivityQueryData,
  WeeklyCommitContributions,
  WeeklyRepositoryActivity,
} from "../../services/github/types";
import { executeGraphQLQuery } from "../../services/github/client";
import { WEEKLY_ACTIVITY_QUERY } from "../../services/github/queries";

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;

export function getWeeklyActivityRange(now = new Date()): { since: string; until: string } {
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const since = new Date(todayUtc - (DAYS_IN_WEEK - 1) * DAY_MS);
  const until = new Date(todayUtc + DAY_MS);

  return {
    since: since.toISOString(),
    until: until.toISOString(),
  };
}

export function buildWeeklyRepositoryActivities(
  repositories: WeeklyCommitContributions[],
  since: string,
  limit = 5,
): WeeklyRepositoryActivity[] {
  const dayKeys = Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
    const date = new Date(new Date(since).getTime() + index * DAY_MS);
    return date.toISOString().slice(0, 10);
  });

  return repositories
    .filter((repo) => !repo.repository.isFork)
    .map((repo) => {
      const countsByDay = new Map(dayKeys.map((dayKey) => [dayKey, 0]));

      for (const contribution of repo.contributions.nodes) {
        const dayKey = contribution.occurredAt.slice(0, 10);
        const count = countsByDay.get(dayKey);

        if (count !== undefined) {
          countsByDay.set(dayKey, count + contribution.commitCount);
        }
      }

      return {
        name: repo.repository.name,
        dailyCounts: dayKeys.map((dayKey) => countsByDay.get(dayKey) ?? 0),
      };
    })
    .filter((repo) => repo.dailyCounts.some((count) => count > 0))
    .toSorted((a, b) => {
      const totalA = a.dailyCounts.reduce((sum, count) => sum + count, 0);
      const totalB = b.dailyCounts.reduce((sum, count) => sum + count, 0);

      return totalB - totalA || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export async function fetchWeeklyActivity(
  username: string,
  githubToken?: string,
  repoLimit = 10,
): Promise<WeeklyRepositoryActivity[]> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  try {
    const { since, until } = getWeeklyActivityRange();
    const data = await executeGraphQLQuery<WeeklyActivityQueryData>(
      WEEKLY_ACTIVITY_QUERY,
      { username, repoLimit, from: since, to: until },
      githubToken,
    );

    if (!data.user) {
      throw new Error("User not found");
    }

    return buildWeeklyRepositoryActivities(
      data.user.contributionsCollection.commitContributionsByRepository,
      since,
    );
  } catch (error) {
    console.error("Error fetching weekly activity:", error);
    throw error;
  }
}
