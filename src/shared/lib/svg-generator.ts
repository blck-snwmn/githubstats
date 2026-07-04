import satori from "satori";
import type { JSXNode, FC } from "hono/jsx";
import type { FontData } from "./font-loader";

/**
 * Options for SVG generation using Satori
 */
export interface SatoriSVGOptions {
  width: number;
  height: number;
  fonts: FontData | FontData[];
}

/**
 * Generate SVG from JSX component using Satori
 *
 * This is a shared wrapper around Satori that provides:
 * - Consistent error handling
 * - Type safety
 * - Default values
 *
 * @param component JSX component to render as SVG (JSXNode or FC return value)
 * @param options SVG generation options
 * @returns SVG string
 */
export async function generateSVG(
  component: JSXNode | ReturnType<FC>,
  options: SatoriSVGOptions,
): Promise<string> {
  const { width, height, fonts } = options;

  // Ensure fonts is always an array for Satori
  const fontArray = Array.isArray(fonts) ? fonts : [fonts];

  try {
    const svg = await satori(toSatoriNode(component), {
      width,
      height,
      fonts: fontArray,
    });

    return svg;
  } catch (error) {
    console.error("Failed to generate SVG:", error);
    throw new Error("SVG generation failed", { cause: error });
  }
}

/**
 * Interop boundary between Hono's JSX runtime and Satori, which expects
 * React-shaped nodes. The two trees are structurally compatible at runtime,
 * so this is the single place that bridges them.
 */
function toSatoriNode(node: JSXNode | ReturnType<FC>): Parameters<typeof satori>[0] {
  return node;
}
