import { describe, expect, it } from "vitest";
import { loadInterFonts } from "../../src/shared/lib/font-loader";
import { generateSVG } from "../../src/shared/lib/svg-generator";

describe("Satori in workerd", () => {
  it("generates an SVG in the Cloudflare Workers runtime", async () => {
    const svg = await generateSVG(<div style={{ display: "flex" }}>HarfBuzz</div>, {
      width: 100,
      height: 100,
      fonts: await loadInterFonts(),
    });

    expect(svg).toMatch(/^<svg[^>]*>/);
    expect(svg).toContain("<path");
  });
});
