import { describe, expect, it } from "vitest";
import { generateSVG } from "../../src/shared/lib/svg-generator";

describe("Satori in workerd", () => {
  it("generates an SVG in the Cloudflare Workers runtime", async () => {
    const svg = await generateSVG(<div style={{ display: "flex" }} />, {
      width: 100,
      height: 100,
      fonts: [],
    });

    expect(svg).toMatch(/^<svg[^>]*>/);
  });
});
