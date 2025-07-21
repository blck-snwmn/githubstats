import { describe, it, expect, beforeAll } from "vitest";
import satori from "satori";
import { ProgressBar } from "./ProgressBar";
import { getTestFontData } from "../test-utils/font-helper";

describe("ProgressBar SVG Output", () => {
  let fontData: ArrayBuffer;

  beforeAll(async () => {
    fontData = await getTestFontData();
  });

  const renderToSVG = async (component: unknown) => {
    return await satori(component as Parameters<typeof satori>[0], {
      width: 400,
      height: 50,
      fonts: [{ name: "Inter", data: fontData, weight: 400, style: "normal" }],
    });
  };

  it("should render single segment progress bar correctly", async () => {
    const svg = await renderToSVG(<ProgressBar percentage={75} color="#3178c6" />);

    // SVGが正しく生成されている
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");

    // 背景色が含まれている
    expect(svg).toContain("#30363d");

    // プログレスバーの色が含まれている
    expect(svg).toContain("#3178c6");
  });

  it("should render multi-segment progress bar with correct segments", async () => {
    const svg = await renderToSVG(
      <ProgressBar
        percentage={[30, 25, 20]}
        color={["#3178c6", "#f1e05a", "#00ADD8"]}
        multiSegment={true}
      />,
    );

    // 各セグメントの色が含まれている
    expect(svg).toContain("#3178c6");
    expect(svg).toContain("#f1e05a");
    expect(svg).toContain("#00ADD8");
  });

  it("should handle custom height", async () => {
    const defaultHeightSvg = await renderToSVG(<ProgressBar percentage={50} color="#000000" />);

    const customHeightSvg = await renderToSVG(
      <ProgressBar percentage={50} color="#000000" height={10} />,
    );

    // 異なる高さは異なるSVGを生成する
    expect(defaultHeightSvg).not.toBe(customHeightSvg);
  });

  it("should render empty progress bar when percentage is 0", async () => {
    const svg = await renderToSVG(<ProgressBar percentage={0} color="#3178c6" />);

    // SVGは生成されるが、プログレス部分は0%
    expect(svg).toContain("<svg");
    expect(svg).toContain("#30363d"); // 背景色のみ
  });

  it("should handle percentage overflow gracefully", async () => {
    const svg = await renderToSVG(<ProgressBar percentage={150} color="#3178c6" />);

    // SVGが正常に生成される（Satoriが150%をどう扱うかに依存）
    expect(svg).toContain("<svg");
    expect(svg).toContain("#3178c6");
  });

  it("should apply segment gaps in multi-segment mode", async () => {
    const noGapSvg = await renderToSVG(
      <ProgressBar
        percentage={[50, 50]}
        color={["#000", "#fff"]}
        multiSegment={true}
        segmentGap={0}
      />,
    );

    const withGapSvg = await renderToSVG(
      <ProgressBar
        percentage={[50, 50]}
        color={["#000", "#fff"]}
        multiSegment={true}
        segmentGap={5}
      />,
    );

    // ギャップの有無で異なるSVGが生成される
    expect(noGapSvg).not.toBe(withGapSvg);
  });
});
