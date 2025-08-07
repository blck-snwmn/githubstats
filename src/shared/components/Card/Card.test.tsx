import { describe, it, expect, beforeAll } from "vitest";
import satori from "satori";
import { Card } from "./Card";
import { getTestFontData } from "../../../test-utils/font-helper";

describe("Card Component", () => {
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

  it("should render card with title and children", async () => {
    const svg = await renderToSVG(
      <Card title="Test Title">
        <div>Test Content</div>
      </Card>,
    );

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg.length).toBeGreaterThan(1000); // 複雑な構造のSVG
  });

  it("should apply custom dimensions", async () => {
    const defaultSvg = await renderToSVG(
      <Card title="Default Size">
        <div>Content</div>
      </Card>,
    );

    const customSvg = await renderToSVG(
      <Card title="Custom Size" width={600} height={300}>
        <div>Content</div>
      </Card>,
    );

    // 異なるサイズは異なるSVGを生成
    expect(defaultSvg).not.toBe(customSvg);
  });

  it("should render multiple children correctly", async () => {
    const svg = await renderToSVG(
      <Card title="Multiple Children">
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </Card>,
    );

    expect(svg).toContain("<svg");
    expect(svg.length).toBeGreaterThan(2000); // より複雑な構造
  });

  it("should handle string dimensions", async () => {
    const svg = await renderToSVG(
      <Card title="String Dimensions" width="50%" height="300px">
        <div>Content with string dimensions</div>
      </Card>,
    );

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });
});
