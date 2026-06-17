import { describe, it, expect, beforeAll } from "vitest";
import { generateSVG } from "../../../shared/lib/svg-generator";
import { getTestFontData } from "../../../test-utils/font-helper";
import { WeeklyActivityStats } from "./WeeklyActivityStats";

describe("WeeklyActivityStats Component", () => {
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

  it("should render weekly activity cells", async () => {
    const svg = await renderToSVG(
      <WeeklyActivityStats
        repositories={[
          { name: "githubstats", dailyCounts: [0, 1, 2, 7, 0, 1, 6] },
          { name: "hello-tree-sitter", dailyCounts: [0, 2, 0, 0, 7, 0, 0] },
        ]}
      />,
    );

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("#39d353");
    expect(svg).toContain("#0e4429");
    expect(svg.length).toBeGreaterThan(3000);
  });

  it("should handle empty repository list", async () => {
    const svg = await renderToSVG(<WeeklyActivityStats repositories={[]} />);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg.length).toBeGreaterThan(1000);
  });
});
