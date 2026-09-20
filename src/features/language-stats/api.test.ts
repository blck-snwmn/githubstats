import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchUserLanguageStats } from "./api";

interface SearchItem {
  archived: boolean;
  fork: boolean;
  language: string | null;
}

function createSearchResponse(
  items: SearchItem[],
  totalCount = items.length,
  incompleteResults = false,
): Response {
  return new Response(
    JSON.stringify({
      total_count: totalCount,
      incomplete_results: incompleteResults,
      items,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("fetchUserLanguageStats", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requires a GitHub token", async () => {
    await expect(fetchUserLanguageStats("octocat")).rejects.toThrow(
      "GitHub token is required for API access",
    );
  });

  it("counts primary languages and ignores repositories without a language", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createSearchResponse([
        { archived: false, fork: false, language: "TypeScript" },
        { archived: false, fork: false, language: "TypeScript" },
        { archived: false, fork: false, language: "Go" },
        { archived: false, fork: false, language: null },
        { archived: true, fork: false, language: "Python" },
        { archived: false, fork: true, language: "Rust" },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchUserLanguageStats("octocat", "token")).resolves.toEqual({
      TypeScript: 2,
      Go: 1,
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();
    const [url, init] = firstCall;
    const requestUrl = new URL(String(url));
    expect(requestUrl.pathname).toBe("/search/repositories");
    expect(requestUrl.searchParams.get("q")).toBe("user:octocat fork:false archived:false");
    expect(requestUrl.searchParams.get("per_page")).toBe("100");
    expect(requestUrl.searchParams.get("page")).toBe("1");
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer token");
  });

  it("fetches remaining result pages", async () => {
    const fetchMock = vi.fn().mockImplementation((input: string) => {
      const page = new URL(input).searchParams.get("page");

      if (page === "1") {
        return Promise.resolve(
          createSearchResponse([{ archived: false, fork: false, language: "TypeScript" }], 101),
        );
      }

      return Promise.resolve(
        createSearchResponse([{ archived: false, fork: false, language: "Go" }], 101),
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchUserLanguageStats("octocat", "token")).resolves.toEqual({
      TypeScript: 1,
      Go: 1,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rejects incomplete search results", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(createSearchResponse([], 0, true)));

    await expect(fetchUserLanguageStats("octocat", "token")).rejects.toThrow(
      "GitHub returned incomplete repository search results",
    );
  });

  it("reports GitHub API errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("rate limited", { status: 403 })),
    );

    await expect(fetchUserLanguageStats("octocat", "token")).rejects.toThrow(
      "GitHub API error: 403 - rate limited",
    );
  });
});
