import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import { generateSVG } from "../../src/shared/lib/svg-generator";

declare global {
  namespace Cloudflare {
    interface Env {
      TEST_FONT_BASE64: string;
    }
  }
}

describe("Satori in workerd", () => {
  it("generates an SVG in the Cloudflare Workers runtime", async () => {
    const font = Uint8Array.from(atob(env.TEST_FONT_BASE64), (char) => char.charCodeAt(0));
    const svg = await generateSVG(<div style={{ display: "flex" }}>HarfBuzz</div>, {
      width: 100,
      height: 100,
      fonts: {
        name: "Inter",
        data: font.buffer,
        weight: 400,
        style: "normal",
      },
    });

    expect(svg).toMatch(/^<svg[^>]*>/);
    expect(svg).toContain("<path");
  });
});
