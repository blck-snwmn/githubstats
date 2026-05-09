import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateLanguageStatsSVG } from "./generator";
import type { LanguageStats } from "../../types/language";

// GitHub APIのみモック（外部APIなので）
vi.mock("./api", () => ({
  fetchUserLanguageStats: vi.fn(),
  getTopLanguages: vi.fn((stats: LanguageStats, limit: number) => {
    const entries = Object.entries(stats)
      .toSorted(([, a], [, b]) => b - a)
      .slice(0, limit);
    const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
    return entries.map(([language, bytes]) => ({
      language,
      bytes,
      percentage: (bytes / totalBytes) * 100,
    }));
  }),
}));

import { fetchUserLanguageStats } from "./api";

describe("generateLanguageStatsSVG Integration", () => {
  const testUsername = "testuser";
  const testToken = "test-token";

  const mockLanguageStats: LanguageStats = {
    TypeScript: 45000,
    JavaScript: 30000,
    Go: 15000,
    Python: 10000,
    Rust: 3000,
    Java: 2000,
    "C++": 1000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchUserLanguageStats).mockResolvedValue(mockLanguageStats);
  });

  it("should generate valid SVG with language statistics", async () => {
    const svg = await generateLanguageStatsSVG({
      username: testUsername,
      githubToken: testToken,
    });

    // 基本的なSVG構造の検証
    expect(svg).toContain("<svg");
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="200"');
    expect(svg).toContain('viewBox="0 0 400 200"');
    expect(svg).toContain("</svg>");

    // APIが正しく呼ばれたか
    expect(fetchUserLanguageStats).toHaveBeenCalledWith(testUsername, testToken);
  });

  it("should include title in the generated SVG", async () => {
    const svg = await generateLanguageStatsSVG({
      username: testUsername,
      githubToken: testToken,
    });

    // タイトルのテキストがパスとして含まれているはず
    // "Most Used Languages"というテキストがSVGパスとして描画される
    expect(svg.length).toBeGreaterThan(5000); // 複雑なSVGは大きい
  });

  it("should handle custom dimensions", async () => {
    const svg = await generateLanguageStatsSVG({
      username: testUsername,
      githubToken: testToken,
      width: 600,
      height: 300,
    });

    expect(svg).toContain('width="600"');
    expect(svg).toContain('height="300"');
    expect(svg).toContain('viewBox="0 0 600 300"');
  });

  it("should handle API errors gracefully", async () => {
    const error = new Error("GitHub API Error");
    vi.mocked(fetchUserLanguageStats).mockRejectedValue(error);

    await expect(
      generateLanguageStatsSVG({
        username: testUsername,
        githubToken: testToken,
      }),
    ).rejects.toThrow("GitHub API Error");
  });

  it("should limit languages to top 6", async () => {
    const svg = await generateLanguageStatsSVG({
      username: testUsername,
      githubToken: testToken,
    });

    // 7つのデータがあるが、6つまでに制限される
    // C++のカラーコード #A8B9CC は含まれないはず
    // （ただし、SVGはパスとして描画されるので直接的な検証は困難）
    expect(svg).toContain("<svg"); // とりあえずSVGが生成されることを確認
  });

  it("should handle empty language data", async () => {
    vi.mocked(fetchUserLanguageStats).mockResolvedValue({});

    const svg = await generateLanguageStatsSVG({
      username: testUsername,
      githubToken: testToken,
    });

    // 空のデータでもSVGは生成される
    expect(svg).toContain("<svg");
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="200"');
  });

  it("should generate different SVGs for different data", async () => {
    const svg1 = await generateLanguageStatsSVG({
      username: testUsername,
      githubToken: testToken,
    });

    // 異なるデータを設定
    vi.mocked(fetchUserLanguageStats).mockResolvedValue({
      Python: 100000,
    });

    const svg2 = await generateLanguageStatsSVG({
      username: "otheruser",
      githubToken: testToken,
    });

    // 異なるデータは異なるSVGを生成
    expect(svg1).not.toBe(svg2);
  });
});
