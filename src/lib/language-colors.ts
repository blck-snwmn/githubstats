import type { CSSProperties } from "hono/jsx";
import { colors } from "./colors";

// Language colors based on GitHub's language colors
export const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  React: "#61dafb",
  Svelte: "#ff3e00",
  Dockerfile: "#2496ED",
  Makefile: "#427819",
  Vim: "#019733",
  Zig: "#ec915c",
  Elixir: "#6e4a7e",
  Scala: "#c22d40",
  Haskell: "#5e5086",
  Lua: "#000080",
  R: "#198CE7",
  Julia: "#a270ba",
  OCaml: "#ef7a08",
  Clojure: "#db5855",
  Perl: "#0298c3",
  Nix: "#7e7eff",
  Solidity: "#AA6746",
  Jupyter: "#DA5B0B",
  MATLAB: "#e16737",
};

/**
 * Creates a circular color dot style for language indicators
 * @param size - The size of the dot in pixels
 * @param color - The background color of the dot
 * @returns CSS properties for a circular colored dot
 */
export const colorDotStyle = (size: number, color: string): CSSProperties => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: "50%",
  backgroundColor: color,
  flexShrink: 0,
});

/**
 * Get color for a programming language
 * @param language - Language name as string or object with name and optional color
 * @returns Hex color code for the language
 */
export function getLanguageColor(language: string): string;
export function getLanguageColor(language: { name: string; color?: string | null }): string;
export function getLanguageColor(
  language: string | { name: string; color?: string | null },
): string {
  if (typeof language === "string") {
    return languageColors[language] || colors.language.default;
  }
  return languageColors[language.name] || language.color || colors.language.default;
}
