import { describe, expect, it, vi, beforeEach } from "vitest";
import { generateWeeklyActivitySVG } from "./generator";
import type { WeeklyRepositoryActivity } from "../../services/github/types";

vi.mock("./api", () => ({
  fetchWeeklyActivity: vi.fn(),
}));

import { fetchWeeklyActivity } from "./api";

describe("generateWeeklyActivitySVG Integration", () => {
  const testUsername = "testuser";
  const testToken = "test-token";

  const mockActivity: WeeklyRepositoryActivity[] = [
    { name: "githubstats", dailyCounts: [0, 1, 2, 4, 0, 1, 4] },
    { name: "hello-tree-sitter", dailyCounts: [0, 2, 0, 0, 4, 0, 0] },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchWeeklyActivity).mockResolvedValue(mockActivity);
  });

  it("should generate valid SVG with weekly activity", async () => {
    const svg = await generateWeeklyActivitySVG({
      username: testUsername,
      githubToken: testToken,
    });

    expect(svg).toContain("<svg");
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="200"');
    expect(svg).toContain('viewBox="0 0 400 200"');
    expect(svg).toContain("</svg>");
    expect(fetchWeeklyActivity).toHaveBeenCalledWith(testUsername, testToken);
  });

  it("should handle API errors gracefully", async () => {
    const error = new Error("GitHub API Error");
    vi.mocked(fetchWeeklyActivity).mockRejectedValue(error);

    await expect(
      generateWeeklyActivitySVG({
        username: testUsername,
        githubToken: testToken,
      }),
    ).rejects.toThrow("GitHub API Error");
  });
});
