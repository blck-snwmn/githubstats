import type { CSSProperties } from "hono/jsx";

// GitHub-style dark theme colors
export const colors = {
  background: {
    primary: "#0d1117",
    secondary: "#161b22",
  },
  text: {
    primary: "#c9d1d9",
    secondary: "#8b949e",
    accent: "#58a6ff",
  },
  language: {
    default: "#586069",
  },
};

// Base container style for all stat cards
export const baseContainerStyle: CSSProperties = {
  backgroundColor: colors.background.primary,
  color: colors.text.primary,
  fontFamily: "Inter, sans-serif",
  display: "flex",
  flexDirection: "column",
};

// Container style with standard padding and border radius
export const cardContainerStyle: CSSProperties = {
  ...baseContainerStyle,
  borderRadius: "8px",
  padding: "8px 16px 12px",
};

// Common title style for all cards
export const titleStyle: CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  margin: 0,
  marginBottom: "8px",
  color: colors.text.accent,
};

// Language color dot style factory
export const colorDotStyle = (size: number, color: string): CSSProperties => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: "50%",
  backgroundColor: color,
  flexShrink: 0,
});

// Progress bar background style
export const progressBarBackgroundStyle: CSSProperties = {
  backgroundColor: colors.background.secondary,
  overflow: "hidden",
};

// Secondary text style
export const secondaryTextStyle: CSSProperties = {
  color: colors.text.secondary,
};

// Language name with color dot container
export const languageItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};
