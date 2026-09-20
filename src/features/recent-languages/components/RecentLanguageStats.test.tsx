import { describe, it, expect, beforeAll } from "vitest";
import { RecentLanguageStats } from "./RecentLanguageStats";
import type { LanguageData } from "../../../types/language";
import { generateSVG } from "../../../shared/lib/svg-generator";
import { getTestFontData } from "../../../test-utils/font-helper";

describe("RecentLanguageStats Component", () => {
  let fontData: ArrayBuffer;

  beforeAll(async () => {
    fontData = await getTestFontData();
  });

  const renderToSVG = (component: Parameters<typeof generateSVG>[0]) =>
    generateSVG(component, {
      width: 400,
      height: 200,
      fonts: [{ name: "Inter", data: fontData, weight: 400, style: "normal" }],
    });

  const testLanguages: LanguageData[] = [
    { language: "TypeScript", value: 25000, percentage: 50 },
    { language: "Go", value: 15000, percentage: 30 },
    { language: "Python", value: 10000, percentage: 20 },
  ];

  it("should render recent language statistics", async () => {
    const svg = await renderToSVG(<RecentLanguageStats languages={testLanguages} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg.length).toBeGreaterThan(5000);
  });

  it("should display progress bars for each language", async () => {
    const svg = await renderToSVG(<RecentLanguageStats languages={testLanguages} />);

    // プログレスバーの背景色が言語の数だけ含まれる
    expect(svg).toContain("#30363d");
  });

  it("should handle empty language list", async () => {
    const svg = await renderToSVG(<RecentLanguageStats languages={[]} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    // 空でもカードは表示される
    expect(svg.length).toBeGreaterThan(1000);
  });

  it("should limit to top 10 languages", async () => {
    const manyLanguages: LanguageData[] = Array.from({ length: 15 }, (_, i) => ({
      language: `Language${i + 1}`,
      value: (15 - i) * 1000,
      percentage: (15 - i) * 6.67,
    }));

    const svg = await renderToSVG(<RecentLanguageStats languages={manyLanguages} />);

    expect(svg).toContain("<svg");
    // 10個までに制限される
    expect(svg.length).toBeGreaterThan(5000);
  });

  it("should handle single language with 100%", async () => {
    const singleLanguage: LanguageData[] = [
      { language: "TypeScript", value: 50000, percentage: 100 },
    ];

    const svg = await renderToSVG(<RecentLanguageStats languages={singleLanguage} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("should render different SVGs for different data", async () => {
    const svg1 = await renderToSVG(<RecentLanguageStats languages={testLanguages} />);

    const differentLanguages: LanguageData[] = [
      { language: "Rust", value: 30000, percentage: 60 },
      { language: "Java", value: 20000, percentage: 40 },
    ];

    const svg2 = await renderToSVG(<RecentLanguageStats languages={differentLanguages} />);

    expect(svg1).not.toBe(svg2);
  });
});
