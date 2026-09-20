import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchRecentLanguageStats } from "./api";

function createGraphQLResponse(): Response {
  return new Response(
    JSON.stringify({
      data: {
        user: {
          repositories: {
            edges: [
              {
                node: {
                  name: "web-app",
                  isFork: false,
                  languages: {
                    edges: [
                      { size: 120, node: { name: "TypeScript", color: "#3178c6" } },
                      { size: 30, node: { name: "CSS", color: "#663399" } },
                    ],
                  },
                },
              },
              {
                node: {
                  name: "worker",
                  isFork: false,
                  languages: {
                    edges: [{ size: 80, node: { name: "TypeScript", color: "#3178c6" } }],
                  },
                },
              },
              {
                node: {
                  name: "defensive-fork",
                  isFork: true,
                  languages: {
                    edges: [{ size: 500, node: { name: "Rust", color: "#dea584" } }],
                  },
                },
              },
            ],
          },
        },
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("fetchRecentLanguageStats", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requires a GitHub token", async () => {
    await expect(fetchRecentLanguageStats("octocat")).rejects.toThrow(
      "GitHub token is required for API access",
    );
  });

  it("fetches recent owned repositories and aggregates their languages", async () => {
    const fetchMock = vi.fn().mockResolvedValue(createGraphQLResponse());
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchRecentLanguageStats("octocat", "token", 12)).resolves.toEqual({
      TypeScript: 200,
      CSS: 30,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(String(init.body));

    expect(body.variables).toEqual({ username: "octocat", repoLimit: 12 });
    expect(body.query).toContain("first: $repoLimit");
    expect(body.query).toContain("isFork: false");
    expect(body.query).toContain("isArchived: false");
    expect(body.query).toContain("orderBy: {field: PUSHED_AT, direction: DESC}");
  });
});
