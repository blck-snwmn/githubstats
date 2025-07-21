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
    // Satori expects ReactNode, but works with Hono's JSX in practice
    // Type assertion is necessary due to different JSX implementations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Intentional due to JSX type mismatch between Hono and React
    const svg = await satori(component as any, {
      width,
      height,
      fonts: fontArray,
    });

    return svg;
  } catch (error) {
    console.error("Failed to generate SVG:", error);
    throw new Error("SVG generation failed");
  }
}
