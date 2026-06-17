import { describe, expect, it } from "vitest";
import { buildWeeklyRepositoryActivities, getWeeklyActivityRange } from "./api";
import type { WeeklyActivityRepositoryNode } from "../../services/github/types";

function repo(
  name: string,
  committedDates: string[],
  isFork = false,
): WeeklyActivityRepositoryNode {
  return {
    name,
    isFork,
    defaultBranchRef: {
      target: {
        targetType: "Commit",
        history: {
          totalCount: committedDates.length,
          nodes: committedDates.map((committedDate) => ({ committedDate })),
        },
      },
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

  it("builds daily counts and sorts repositories by weekly activity", () => {
    const activities = buildWeeklyRepositoryActivities(
      [
        repo("small-repo", ["2026-06-15T09:00:00Z"]),
        repo("busy-repo", ["2026-06-12T09:00:00Z", "2026-06-12T10:00:00Z", "2026-06-17T11:00:00Z"]),
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
        repo("one", ["2026-06-11T09:00:00Z"]),
        repo("two", ["2026-06-12T09:00:00Z"]),
        repo("forked", ["2026-06-13T09:00:00Z"], true),
        repo("empty", []),
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
