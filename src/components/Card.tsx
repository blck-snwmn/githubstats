import type { CSSProperties, PropsWithChildren } from "hono/jsx";
import { colors } from "../lib/colors";
import { fonts } from "../lib/fonts";

type CardProps = PropsWithChildren<{
  title: string;
  width?: number | string;
  height?: number | string;
}>;

export function Card({ title, width = "100%", height = "100%", children }: CardProps) {
  const containerStyle: CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    backgroundColor: colors.background.primary,
    borderRadius: "8px",
    padding: "16px 20px",
    fontFamily: fonts.family,
    color: colors.text.primary,
    display: "flex",
    flexDirection: "column",
  };

  const titleStyle: CSSProperties = {
    fontSize: fonts.size.title,
    fontWeight: fonts.weight.semibold,
    margin: 0,
    marginBottom: "8px",
    color: colors.text.accent,
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );
}
