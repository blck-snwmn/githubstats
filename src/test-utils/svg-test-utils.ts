import { vi } from "vitest";

export const mockSatori = vi.fn().mockImplementation(async (_element, _options) => {
  return "<svg>mocked svg content</svg>";
});

export function validateSvgString(svg: string): boolean {
  return svg.startsWith("<svg") && svg.endsWith("</svg>");
}

export function extractSvgContent(svg: string): {
  width?: string;
  height?: string;
  viewBox?: string;
} {
  const widthMatch = svg.match(/width="(\d+)"/);
  const heightMatch = svg.match(/height="(\d+)"/);
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);

  return {
    width: widthMatch?.[1],
    height: heightMatch?.[1],
    viewBox: viewBoxMatch?.[1],
  };
}

export const mockFontArrayBuffer = new ArrayBuffer(8);

export function setupSatoriMock() {
  vi.mock("satori", () => ({
    default: mockSatori,
  }));
}

export function setupFetchMock() {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    arrayBuffer: async () => mockFontArrayBuffer,
  } as Response);
}
