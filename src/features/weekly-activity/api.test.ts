import { describe, expect, it } from "vitest";
import { buildWeeklyRepositoryActivities, getWeeklyActivityRange } from "./api";
import type { WeeklyCommitContributions } from "../../services/github/types";

function repo(
  name: string,
  commitCountsByDay: Record<string, number>,
  isFork = false,
): WeeklyCommitContributions {
  return {
    repository: { name, isFork },
    contributions: {
      nodes: Object.entries(commitCountsByDay).map(([day, commitCount]) => ({
        occurredAt: `${day}T07:00:00Z`,
        commitCount,
      })),
    },
  };
}

describe("weekly activity api", () => {
  it("builds a seven-day UTC range including today", () => {
    const range = getWeeklyActivityRange(new Date("2026-06-17T15:30:00Z"));

    expect(range).toEqual({
      since: "2026-06-11T00:00:00.000Z",
      until: "2026-06-18T00:00:00.000Z",
    });
  });

  it("builds daily counts, ignores days outside the range, and sorts repositories by weekly activity", () => {
    const activities = buildWeeklyRepositoryActivities(
      [
        repo("small-repo", { "2026-06-15": 1 }),
        repo("busy-repo", { "2026-06-12": 2, "2026-06-17": 1, "2026-06-10": 4 }),
      ],
      "2026-06-11T00:00:00.000Z",
    );

    expect(activities).toEqual([
      {
        name: "busy-repo",
        dailyCounts: [0, 2, 0, 0, 0, 0, 1],
      },
      {
        name: "small-repo",
        dailyCounts: [0, 0, 0, 0, 1, 0, 0],
      },
    ]);
  });

  it("filters forks, repos with no commits, and applies the display limit", () => {
    const activities = buildWeeklyRepositoryActivities(
      [
        repo("one", { "2026-06-11": 1 }),
        repo("two", { "2026-06-12": 1 }),
        repo("forked", { "2026-06-13": 1 }, true),
        repo("empty", {}),
      ],
      "2026-06-11T00:00:00.000Z",
      1,
    );

    expect(activities).toEqual([
      {
        name: "one",
        dailyCounts: [1, 0, 0, 0, 0, 0, 0],
      },
    ]);
  });
});
