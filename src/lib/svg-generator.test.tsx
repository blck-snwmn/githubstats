import { describe, it, expect, beforeAll } from "vitest";
import { generateSVG } from "./svg-generator";
import type { SatoriSVGOptions } from "./svg-generator";
import { getTestFontData } from "../test-utils/font-helper";

const createTestComponent = (content: string) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "white",
    }}
  >
    {content}
  </div>
);

describe("generateSVG", () => {
  let testFontData: ArrayBuffer;

  beforeAll(async () => {
    testFontData = await getTestFontData();
  });

  it("should generate valid SVG with proper structure", async () => {
    const options: SatoriSVGOptions = {
      width: 400,
      height: 200,
      fonts: {
        name: "Inter",
        data: testFontData,
        weight: 400 as const,
        style: "normal",
      },
    };

    const svg = await generateSVG(createTestComponent("Test Content"), options);

    // SVGの基本構造を検証
    expect(svg).toContain("<svg");
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="200"');
    expect(svg).toContain("</svg>");
    expect(svg).toContain('viewBox="0 0 400 200"');
  });

  it("should handle multiple fonts correctly", async () => {
    const fonts = [
      {
        name: "Inter",
        data: testFontData,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Inter",
        data: testFontData,
        weight: 700 as const,
        style: "normal" as const,
      },
    ];

    const svg = await generateSVG(createTestComponent("Multi Font Test"), {
      width: 300,
      height: 150,
      fonts,
    });

    expect(svg).toContain("<svg");
    expect(svg).toContain('width="300"');
    expect(svg).toContain('height="150"');
  });

  it("should generate different SVG for different content", async () => {
    const options: SatoriSVGOptions = {
      width: 200,
      height: 100,
      fonts: {
        name: "Inter",
        data: testFontData,
        weight: 400 as const,
        style: "normal",
      },
    };

    const svg1 = await generateSVG(createTestComponent("Content A"), options);
    const svg2 = await generateSVG(createTestComponent("Content B"), options);

    // 異なるコンテンツは異なるSVGを生成すべき
    expect(svg1).not.toBe(svg2);

    // 両方とも有効なSVG
    expect(svg1).toContain("<svg");
    expect(svg2).toContain("<svg");
  });

  it("should handle complex JSX structures", async () => {
    const complexComponent = (
      <div style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
        <h1 style={{ fontSize: "24px", margin: "0" }}>Title</h1>
        <p style={{ fontSize: "16px", color: "#666" }}>Description text</p>
      </div>
    );

    const svg = await generateSVG(complexComponent, {
      width: 400,
      height: 200,
      fonts: {
        name: "Inter",
        data: testFontData,
        weight: 400 as const,
        style: "normal",
      },
    });

    expect(svg).toContain("<svg");
    expect(svg).toContain('width="400"');
    // SVGには実際のテキストコンテンツがパスとして含まれる
    expect(svg.length).toBeGreaterThan(1000); // 複雑な構造は大きなSVGを生成
  });

  it("should throw error with invalid font data", async () => {
    const invalidFontData = new ArrayBuffer(10); // 無効なフォントデータ

    await expect(
      generateSVG(createTestComponent("Test"), {
        width: 200,
        height: 100,
        fonts: {
          name: "Invalid",
          data: invalidFontData,
          weight: 400 as const,
          style: "normal",
        },
      }),
    ).rejects.toThrow("SVG generation failed");
  });

  it("should handle edge case dimensions", async () => {
    const options: SatoriSVGOptions = {
      width: 1,
      height: 1,
      fonts: {
        name: "Inter",
        data: testFontData,
        weight: 400 as const,
        style: "normal",
      },
    };

    const svg = await generateSVG(createTestComponent("X"), options);

    expect(svg).toContain('width="1"');
    expect(svg).toContain('height="1"');
    expect(svg).toContain("<svg");
  });
});
