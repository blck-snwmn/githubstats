/**
 * Base options for SVG generation
 */
export interface BaseSVGOptions {
  username: string;
  githubToken?: string;
}

/**
 * Options for SVG generation with dimensions
 */
export interface SVGOptionsWithDimensions extends BaseSVGOptions {
  width?: number;
  height?: number;
}
