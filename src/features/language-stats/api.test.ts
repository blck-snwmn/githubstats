import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchUserLanguageStats } from "./api";

interface RepositoryItem {
  archived: boolean;
  fork: boolean;
  language: string | null;
}

function createListResponse(items: RepositoryItem[]): Response {
  return new Response(JSON.stringify(items), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function createUserResponse(publicRepos: number): Response {
  return new Response(JSON.stringify({ public_repos: publicRepos }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function repository(language: string | null): RepositoryItem {
  return { archived: false, fork: false, language };
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
    const fetchMock = vi.fn().mockImplementation((input: string) => {
      if (new URL(input).pathname === "/users/octocat") {
        return Promise.resolve(createUserResponse(6));
      }

      return Promise.resolve(
        createListResponse([
          repository("TypeScript"),
          repository("TypeScript"),
          repository("Go"),
          repository(null),
          { archived: true, fork: false, language: "Python" },
          { archived: false, fork: true, language: "Rust" },
        ]),
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchUserLanguageStats("octocat", "token")).resolves.toEqual({
      TypeScript: 2,
      Go: 1,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const listCall = fetchMock.mock.calls.find(
      ([url]) => new URL(String(url)).pathname === "/users/octocat/repos",
    );
    if (!listCall) {
      throw new Error("Repository list was not requested");
    }
    const [url, init] = listCall;
    const requestUrl = new URL(String(url));
    expect(requestUrl.searchParams.get("type")).toBe("owner");
    expect(requestUrl.searchParams.get("per_page")).toBe("100");
    expect(requestUrl.searchParams.get("page")).toBe("1");
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer token");
  });

  it("fetches remaining pages based on the public repository count", async () => {
    const fetchMock = vi.fn().mockImplementation((input: string) => {
      const requestUrl = new URL(input);

      if (requestUrl.pathname === "/users/octocat") {
        return Promise.resolve(createUserResponse(101));
      }

      if (requestUrl.searchParams.get("page") === "1") {
        return Promise.resolve(
          createListResponse(Array.from({ length: 100 }, () => repository("TypeScript"))),
        );
      }

      return Promise.resolve(createListResponse([repository("Go")]));
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchUserLanguageStats("octocat", "token")).resolves.toEqual({
      TypeScript: 100,
      Go: 1,
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("reports GitHub API errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockImplementation(() => Promise.resolve(new Response("rate limited", { status: 403 }))),
    );

    await expect(fetchUserLanguageStats("octocat", "token")).rejects.toThrow(
      "GitHub API error: 403 - rate limited",
    );
  });
});
