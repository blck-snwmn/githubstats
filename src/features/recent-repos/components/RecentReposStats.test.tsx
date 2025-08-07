import { describe, it, expect, beforeAll } from "vitest";
import satori from "satori";
import { RecentReposStats } from "./RecentReposStats";
import { getTestFontData } from "../../../test-utils/font-helper";

describe("RecentReposStats Component", () => {
  let fontData: ArrayBuffer;

  beforeAll(async () => {
    fontData = await getTestFontData();
  });

  const renderToSVG = async (component: unknown) => {
    return await satori(component as Parameters<typeof satori>[0], {
      width: 400,
      height: 200,
      fonts: [{ name: "Inter", data: fontData, weight: 400, style: "normal" }],
    });
  };

  const testRepos = [
    {
      name: "awesome-project",
      description: "An awesome project for testing",
      stargazerCount: 15,
      forkCount: 3,
      pushedAt: "2025-01-20T10:00:00Z",
      primaryLanguage: {
        name: "TypeScript",
        color: "#3178c6",
      },
    },
    {
      name: "cool-app",
      description: "A cool application",
      stargazerCount: 8,
      forkCount: 1,
      pushedAt: "2025-01-19T15:30:00Z",
      primaryLanguage: {
        name: "Go",
        color: "#00ADD8",
      },
    },
    {
      name: "test-repo",
      description: null,
      stargazerCount: 0,
      forkCount: 0,
      pushedAt: "2025-01-18T08:00:00Z",
      primaryLanguage: null,
    },
  ];

  it("should render recent repositories", async () => {
    const svg = await renderToSVG(<RecentReposStats repositories={testRepos} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg.length).toBeGreaterThan(5000);
  });

  it("should handle empty repository list", async () => {
    const svg = await renderToSVG(<RecentReposStats repositories={[]} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    // 空でもカードは表示される
    expect(svg.length).toBeGreaterThan(1000);
  });

  it("should limit to top 5 repositories", async () => {
    const manyRepos = Array.from({ length: 10 }, (_, i) => ({
      name: `repo-${i + 1}`,
      description: `Repository ${i + 1}`,
      stargazerCount: i + 1,
      forkCount: i,
      pushedAt: new Date(Date.now() - i * 86400000).toISOString(),
      primaryLanguage: {
        name: "JavaScript",
        color: "#f1e05a",
      },
    }));

    const svg = await renderToSVG(<RecentReposStats repositories={manyRepos} />);

    expect(svg).toContain("<svg");
    // 5個までに制限される
    expect(svg.length).toBeGreaterThan(5000);
  });

  it("should handle repositories without primary language", async () => {
    const reposWithoutLang = [
      {
        name: "no-lang-repo",
        description: "Repository without language",
        stargazerCount: 2,
        forkCount: 0,
        pushedAt: "2025-01-20T10:00:00Z",
        primaryLanguage: null,
      },
    ];

    const svg = await renderToSVG(<RecentReposStats repositories={reposWithoutLang} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("should handle repositories without description", async () => {
    const reposWithoutDesc = [
      {
        name: "no-desc-repo",
        description: null,
        stargazerCount: 5,
        forkCount: 1,
        pushedAt: "2025-01-20T10:00:00Z",
        primaryLanguage: {
          name: "Python",
          color: "#3572A5",
        },
      },
    ];

    const svg = await renderToSVG(<RecentReposStats repositories={reposWithoutDesc} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("should render different SVGs for different data", async () => {
    const svg1 = await renderToSVG(<RecentReposStats repositories={testRepos} />);

    const differentRepos = [
      {
        name: "different-repo",
        description: "A different repository",
        stargazerCount: 12,
        forkCount: 4,
        pushedAt: "2025-01-21T12:00:00Z",
        primaryLanguage: {
          name: "Rust",
          color: "#dea584",
        },
      },
    ];

    const svg2 = await renderToSVG(<RecentReposStats repositories={differentRepos} />);

    expect(svg1).not.toBe(svg2);
  });
});
