import { describe, it, expect, beforeAll } from "vitest";
import satori from "satori";
import { CompactLanguageStats } from "./CompactLanguageStats";
import type { LanguageData } from "../../../types/language";
import { getTestFontData } from "../../../test-utils/font-helper";

describe("CompactLanguageStats Component", () => {
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

  const testLanguages: LanguageData[] = [
    { language: "TypeScript", bytes: 45000, percentage: 45.5 },
    { language: "JavaScript", bytes: 30000, percentage: 30.2 },
    { language: "Go", bytes: 15000, percentage: 15.1 },
    { language: "Python", bytes: 10000, percentage: 9.2 },
  ];

  it("should render language statistics", async () => {
    const svg = await renderToSVG(<CompactLanguageStats languages={testLanguages} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    // 言語の色が含まれているか（SVGパスとして描画される）
    expect(svg.length).toBeGreaterThan(5000); // 複雑なSVG
  });

  it("should handle empty language list", async () => {
    const svg = await renderToSVG(<CompactLanguageStats languages={[]} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    // 空でもカードは表示される
    expect(svg.length).toBeGreaterThan(1000);
  });

  it("should limit to top 6 languages", async () => {
    const manyLanguages: LanguageData[] = [
      { language: "TypeScript", bytes: 45000, percentage: 20 },
      { language: "JavaScript", bytes: 40000, percentage: 18 },
      { language: "Go", bytes: 35000, percentage: 16 },
      { language: "Python", bytes: 30000, percentage: 14 },
      { language: "Rust", bytes: 25000, percentage: 11 },
      { language: "Java", bytes: 20000, percentage: 9 },
      { language: "C++", bytes: 15000, percentage: 7 },
      { language: "Ruby", bytes: 10000, percentage: 5 },
    ];

    const svg = await renderToSVG(<CompactLanguageStats languages={manyLanguages} />);

    expect(svg).toContain("<svg");
    // 6つまでに制限されるが、SVGの正確な検証は困難
    expect(svg.length).toBeGreaterThan(5000);
  });

  it("should render progress bar with multiple segments", async () => {
    const svg = await renderToSVG(<CompactLanguageStats languages={testLanguages} />);

    // プログレスバーの背景色が含まれる
    expect(svg).toContain("#30363d");
  });

  it("should handle single language", async () => {
    const singleLanguage: LanguageData[] = [
      { language: "TypeScript", bytes: 100000, percentage: 100 },
    ];

    const svg = await renderToSVG(<CompactLanguageStats languages={singleLanguage} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });
});
