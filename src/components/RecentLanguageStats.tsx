import type { CSSProperties } from "hono/jsx";
import { languageColors } from "../lib/language-colors";
import { colors } from "../lib/colors";
import { fonts } from "../lib/fonts";
import { Card } from "./Card";

interface RecentLanguageStatsProps {
  languages: Array<{ language: string; bytes: number; percentage: number }>;
}

// Language color dot
const colorDotStyle = (size: number, color: string): CSSProperties => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: "50%",
  backgroundColor: color,
  flexShrink: 0,
});

const progressBarStyle = (percentage: number, color: string): CSSProperties => ({
  width: `${percentage}%`,
  height: "100%",
  backgroundColor: color,
  borderRadius: "3px",
});

export function RecentLanguageStats({ languages }: RecentLanguageStatsProps) {
  const languageItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const languageNameContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const languageNameStyle: CSSProperties = {
    fontSize: fonts.size.body,
    fontWeight: fonts.weight.medium,
  };

  const percentageStyle: CSSProperties = {
    fontSize: fonts.size.body,
    color: colors.text.secondary,
  };

  const progressBarContainerStyle: CSSProperties = {
    width: "100%",
    height: "6px",
    backgroundColor: colors.background.secondary,
    borderRadius: "3px",
    overflow: "hidden",
    display: "flex",
  };

  return (
    <Card title="Recently Used Languages" width={400} height={150}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {languages.map((lang) => {
          const color = languageColors[lang.language] || colors.language.default;
          return (
            <div
              key={lang.language}
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              <div style={languageItemStyle}>
                <div style={languageNameContainerStyle}>
                  <div style={colorDotStyle(12, color)} />
                  <span style={languageNameStyle}>{lang.language}</span>
                </div>
                <span style={percentageStyle}>{lang.percentage.toFixed(1)}%</span>
              </div>
              <div style={progressBarContainerStyle}>
                <div style={progressBarStyle(lang.percentage, color)} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
